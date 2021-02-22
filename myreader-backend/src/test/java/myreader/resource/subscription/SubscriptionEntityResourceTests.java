package myreader.resource.subscription;

import myreader.entity.ExclusionPattern;
import myreader.entity.FetchError;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.service.subscription.SubscriptionService;
import myreader.test.WithTestProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.data.jdbc.core.JdbcAggregateOperations;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

import static myreader.test.CustomMockMvcResultMatchers.validation;
import static myreader.test.OffsetDateTimes.ofEpochMilli;
import static myreader.test.request.JsonRequestPostProcessors.jsonBody;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.hamcrest.Matchers.is;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
@Transactional
@SpringBootTest
@WithMockUser
@WithTestProperties
class SubscriptionEntityResourceTests {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private JdbcAggregateOperations template;

  @SpyBean
  private SubscriptionService subscriptionService;

  private Subscription subscription;

  @BeforeEach
  void setUp() {
    subscription = template.save(new Subscription(
      "http://example.com",
      "expected title",
      "subscriptiontag name",
      "#111111",
      15,
      null,
      0,
      null,
      ofEpochMilli(2000)
    ));

    template.save(new ExclusionPattern("pattern", subscription.getId(), 0, ofEpochMilli(1000)));

    template.save(new FetchError(subscription.getId(), "message 1", ofEpochMilli(1000)));
    template.save(new FetchError(subscription.getId(), "message 2", ofEpochMilli(2000)));

    template.save(new SubscriptionEntry(
      null,
      null,
      "url",
      null,
      false,
      false,
      Set.of("tag1", "tag2"),
      subscription.getId(),
      ofEpochMilli(1000)
    ));

    given(subscriptionService.valid("http://example.com"))
      .willReturn(true);
  }

  @Test
  void shouldReturnResponse() throws Exception {
    mockMvc.perform(get("/api/2/subscriptions/{id}", subscription.getId()))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.uuid").value(subscription.getId().toString()))
      .andExpect(jsonPath("$.title").value("expected title"))
      .andExpect(jsonPath("$.sum").value(15))
      .andExpect(jsonPath("$.unseen").value(1))
      .andExpect(jsonPath("$.origin").value("http://example.com"))
      .andExpect(jsonPath("$.fetchErrorCount").value(2))
      .andExpect(jsonPath("$.tag").value("subscriptiontag name"))
      .andExpect(jsonPath("$.color").value("#111111"))
      .andExpect(jsonPath("$.createdAt").value("1970-01-01T00:00:02Z"));
  }

  @Test
  void shouldDeleteSubscription() throws Exception {
    mockMvc.perform(delete("/api/2/subscriptions/{id}", subscription.getId()))
      .andExpect(status().isNoContent());

    assertThat(template.findById(subscription.getId(), Subscription.class)).isNull();
  }

  @Test
  void shouldReturnNotFoundWhenSubscriptionIsNotFound() throws Exception {
    mockMvc.perform(patch("/api/2/subscriptions/9999")
      .with(jsonBody("{'title': 'irrelevant', 'origin': 'http://example.com', 'tag' : 'irrelevant'}")))
      .andExpect(status().isNotFound());
  }

  @Test
  void shouldPatchSubscriptionTitleAndOriginAndColor() throws Exception {
    given(subscriptionService.valid("http://other.com"))
      .willReturn(true);

    mockMvc.perform(patch("/api/2/subscriptions/{id}", subscription.getId())
      .with(jsonBody("{'title': 'changed title', 'origin': 'http://other.com', 'tag': 'subscriptiontag name', 'color': '#222222'}")))
      .andExpect(status().isOk())
      .andExpect(jsonPath("title").value("changed title"))
      .andExpect(jsonPath("origin").value("http://other.com"))
      .andExpect(jsonPath("tag").value("subscriptiontag name"))
      .andExpect(jsonPath("color").value("#222222"));
  }

  @Test
  void shouldNotPatchIfNothingChanged() throws Exception {
    mockMvc.perform(patch("/api/2/subscriptions/{id}", subscription.getId())
      .with(jsonBody("{'title': 'expected title', 'origin': 'http://example.com', 'tag': 'subscriptiontag name', 'color': '#111111'}")))
      .andExpect(status().isOk())
      .andExpect(jsonPath("title").value("expected title"))
      .andExpect(jsonPath("origin").value("http://example.com"))
      .andExpect(jsonPath("tag").value("subscriptiontag name"))
      .andExpect(jsonPath("color").value("#111111"));
  }

  @Test
  void shouldRejectPatchRequestWhenTitleAndOriginPropertiesAreAbsent() throws Exception {
    mockMvc.perform(patch("/api/2/subscriptions/{id}", subscription.getId())
      .with(jsonBody("{'feedTag': {}}")))
      .andExpect(status().isBadRequest())
      .andExpect(validation().onField("title").value("may not be empty"));
  }

  @Test
  void shouldValidateSubscriptionTitle() throws Exception {
    mockMvc.perform(patch("/api/2/subscriptions/{id}", subscription.getId())
      .with(jsonBody("{'title': ' ', 'origin': 'http://example.com'}")))
      .andExpect(status().isBadRequest())
      .andExpect(validation().onField("title").value("may not be empty"));
  }

  @Test
  void shouldValidatePatchRequestAbsentOriginProperty() throws Exception {
    mockMvc.perform(patch("/api/2/subscriptions/{id}", subscription.getId())
      .with(jsonBody("{'title': 'some title'}")))
      .andExpect(status().isBadRequest())
      .andExpect(validation().onField("origin").value("invalid syndication feed"));
  }

  @Test
  void shouldValidatePatchRequestInvalidOrigin() throws Exception {
    given(subscriptionService.valid("http://example.local"))
      .willReturn(false);

    mockMvc.perform(patch("/api/2/subscriptions/{id}", subscription.getId())
      .with(jsonBody("{'title': 'some title', 'origin': 'http://example.local'}")))
      .andExpect(status().isBadRequest())
      .andExpect(validation().onField("origin").value("invalid syndication feed"));
  }

  @Test
  void shouldValidatePatchRequestInvalidColor() throws Exception {
    mockMvc.perform(patch("/api/2/subscriptions/{id}", subscription.getId())
      .with(jsonBody("{'title': 'some title', 'origin': 'http://example.local', 'color': 'invalid'}")))
      .andExpect(status().isBadRequest())
      .andExpect(validation().onField("color").value("not a RGB hex code"));
  }

  @Test
  void shouldReturnFetchErrors() throws Exception {
    mockMvc.perform(get("/api/2/subscriptions/{id}/fetchError", subscription.getId()))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.length()", is(2)))
      .andExpect(jsonPath("$.[0].message", is("message 2")))
      .andExpect(jsonPath("$.[0].createdAt", is("1970-01-01T00:00:02Z")))
      .andExpect(jsonPath("$.[1].message", is("message 1")))
      .andExpect(jsonPath("$.[1].createdAt", is("1970-01-01T00:00:01Z")));
  }

  @Test
  void shouldNotReturnFetchErrorsIfSubscriptionContainsNoErrors() throws Exception {
    var subscription2 = template.save(new Subscription(
      "http://other.com",
      "irrelevant",
      null,
      null,
      0,
      null,
      0,
      null,
      ofEpochMilli(1000)
    ));

    mockMvc.perform(get("/api/2/subscriptions/{id}/fetchError", subscription2.getId()))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.length()", is(0)));
  }
}
