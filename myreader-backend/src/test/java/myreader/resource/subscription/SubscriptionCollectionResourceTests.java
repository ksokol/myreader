package myreader.resource.subscription;

import myreader.entity.Subscription;
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
import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;
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
      false,
      ofEpochMilli(2000)
    ));
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
    var nextId = subscription1.getId() + 1;

    given(feedParser.parse(url))
      .willReturn(Optional.of(new FetchResult(List.of(), null, title, url, 10)));

    mockMvc.perform(get("/api/2/subscriptions/{id}", nextId))
      .andExpect(status().isNotFound());

    mockMvc.perform(post("/api/2/subscriptions")
      .with(jsonBody("{'origin': '" + url + "'}")))
      .andExpect(status().isOk())
      .andExpect(jsonPath("uuid").value(nextId));

    assertThat(template.findById(nextId, Subscription.class))
      .isNotNull();
  }
}
