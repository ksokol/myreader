package myreader.resource.subscription;

import myreader.entity.FetchError;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.fetcher.FeedParseException;
import myreader.fetcher.FeedParser;
import myreader.fetcher.persistence.FetchResult;
import myreader.test.WithTestProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.jdbc.core.JdbcAggregateOperations;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static myreader.test.CustomMockMvcResultMatchers.validation;
import static myreader.test.OffsetDateTimes.ofEpochMilli;
import static myreader.test.request.JsonRequestPostProcessors.jsonBody;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
@Transactional
@SpringBootTest
@WithMockUser
@WithTestProperties
class SubscriptionCollectionResourceTests {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private JdbcAggregateOperations template;

  @MockBean
  private FeedParser feedParser;

  private Subscription subscription1;
  private Subscription subscription2;

  @BeforeEach
  void setUp() {
    subscription1 = template.save(new Subscription(
      "http://feed1",
      "user102_subscription1",
      "tag1",
      null,
      10,
      null,
      0,
      null,
      ofEpochMilli(2000)
    ));

    template.save(new FetchError(subscription1.getId(), "message 1", ofEpochMilli(1000)));
    template.save(new FetchError(subscription1.getId(), "message 2", ofEpochMilli(2000)));

    subscription2 = template.save(new Subscription(
      "http://feed2",
      "user102_subscription2",
      "tag2",
      "#111111",
      20,
      null,
      0,
      null,
      ofEpochMilli(4000)
    ));

    template.save(new SubscriptionEntry(
      null,
      null,
      "url",
      null,
      false,
      false,
      null,
      subscription2.getId(),
      ofEpochMilli(1000)
    ));
  }

  @Test
  void shouldReturnExpectedJsonStructure() throws Exception {
    mockMvc.perform(get("/api/2/subscriptions"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.content.length()").value(2))
      .andExpect(jsonPath("$.content[0].uuid").value(subscription2.getId().toString()))
      .andExpect(jsonPath("$.content[0].title").value("user102_subscription2"))
      .andExpect(jsonPath("$.content[0].sum").value(20))
      .andExpect(jsonPath("$.content[0].unseen").value(1))
      .andExpect(jsonPath("$.content[0].origin").value("http://feed2"))
      .andExpect(jsonPath("$.content[0].fetchErrorCount").value(0))
      .andExpect(jsonPath("$.content[0].tag").value("tag2"))
      .andExpect(jsonPath("$.content[0].color").value("#111111"))
      .andExpect(jsonPath("$.content[0].createdAt").value("1970-01-01T00:00:04Z"))
      .andExpect(jsonPath("$.content[1].uuid").value(subscription1.getId().toString()))
      .andExpect(jsonPath("$.content[1].title").value("user102_subscription1"))
      .andExpect(jsonPath("$.content[1].sum").value(10))
      .andExpect(jsonPath("$.content[1].unseen").value(0))
      .andExpect(jsonPath("$.content[1].origin").value("http://feed1"))
      .andExpect(jsonPath("$.content[1].fetchErrorCount").value(2))
      .andExpect(jsonPath("$.content[1].tag").value("tag1"))
      .andExpect(jsonPath("$.content[1].color").isEmpty())
      .andExpect(jsonPath("$.content[1].createdAt").value("1970-01-01T00:00:02Z"));
  }

  @Test
  void shouldNotFindAnySubscriptionsWithUnseenGreaterThanTen() throws Exception {
    mockMvc.perform(get("/api/2/subscriptions?unseenGreaterThan=10"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.content.length()").value(0));
  }

  @Test
  void shouldFindAnySubscriptionsWithUnseenGreaterThanMinusOne() throws Exception {
    mockMvc.perform(get("/api/2/subscriptions?unseenGreaterThan=-1"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.content.length()").value(2))
      .andExpect(jsonPath("$.content[0].uuid").value(subscription2.getId().toString()))
      .andExpect(jsonPath("$.content[1].uuid").value(subscription1.getId().toString()));
  }

  @Test
  void shouldFindAnySubscriptionsWithUnseenGreaterThanZero() throws Exception {
    mockMvc.perform(get("/api/2/subscriptions?unseenGreaterThan=0"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.content.length()").value(1))
      .andExpect(jsonPath("$.content[0].uuid").value(subscription2.getId().toString()));
  }

  @Test
  void shouldRejectPostRequestWhenOriginIsMissing() throws Exception {
    mockMvc.perform(post("/api/2/subscriptions")
      .with(jsonBody("{}")))
      .andExpect(status().isBadRequest())
      .andExpect(validation().onField("origin").value("invalid syndication feed"));
  }

  @Test
  void shouldRejectPostRequestWhenOriginContainsAnInvalidUrl() throws Exception {
    mockMvc.perform(post("/api/2/subscriptions")
      .with(jsonBody("{'url':'invalid url'}")))
      .andExpect(status().isBadRequest())
      .andExpect(validation().onField("origin").value("invalid syndication feed"));
  }

  @Test
  void shouldRejectPostRequestWhenSubscriptionAlreadyExistsForGivenOrigin() throws Exception {
    mockMvc.perform(post("/api/2/subscriptions")
      .with(jsonBody("{'origin' : 'http://feed1'}")))
      .andExpect(status().isBadRequest())
      .andExpect(validation().onField("origin").value("subscription exists"));
  }

  @Test
  void shouldRejectPostRequestWhenOriginIsAnInvalidSyndication() throws Exception {
    var url = "http://invalid";

    given(feedParser.parse(url))
      .willThrow(new FeedParseException());

    mockMvc.perform(post("/api/2/subscriptions")
      .with(jsonBody("{'origin' : '" + url + "'}")))
      .andExpect(status().isBadRequest())
      .andExpect(validation().onField("origin").value("invalid syndication feed"));
  }

  @Test
  void shouldCreateNewSubscriptionForOrigin() throws Exception {
    var url = "http://feed3";
    var title = "expected title";
    var nextId = subscription2.getId() + 1;

    given(feedParser.parse(url))
      .willReturn(Optional.of(new FetchResult(List.of(), null, title, url, 10)));

    mockMvc.perform(get("/api/2/subscriptions/{id}", nextId))
      .andExpect(status().isNotFound());

    mockMvc.perform(post("/api/2/subscriptions")
      .with(jsonBody("{'origin': '" + url + "'}")))
      .andExpect(status().isOk())
      .andExpect(jsonPath("uuid").value(nextId));

    mockMvc.perform(get("/api/2/subscriptions/{id}", nextId))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.uuid").value(nextId))
      .andExpect(jsonPath("$.title").value(title))
      .andExpect(jsonPath("$.origin").value(url));
  }
}
