package myreader.resource.subscription;

import myreader.entity.FetchError;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.service.subscription.SubscriptionService;
import myreader.test.WithTestProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureTestEntityManager;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import javax.transaction.Transactional;
import java.util.Date;

import static myreader.test.CustomMockMvcResultMatchers.validation;
import static myreader.test.request.JsonRequestPostProcessors.jsonBody;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.is;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
@AutoConfigureTestEntityManager
@Transactional
@SpringBootTest
@WithMockUser
@WithTestProperties
class SubscriptionEntityResourceTests {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private TestEntityManager em;

  @SpyBean
  private SubscriptionService subscriptionService;

  private Subscription subscription;

  @BeforeEach
  void setUp() {
    subscription = new Subscription("http://example.com", "feed title");
    subscription.setTitle("expected title");
    subscription.setTag("subscriptiontag name");
    subscription.setColor("#111111");
    subscription.setFetchCount(15);
    subscription.setUnseen(10);
    subscription.setCreatedAt(new Date(2000));
    subscription = em.persist(subscription);

    var fetchError1 = new FetchError(subscription, "message 1");
    fetchError1.setCreatedAt(new Date(1000));
    em.persist(fetchError1);

    var fetchError2 = new FetchError(subscription, "message 2");
    fetchError2.setCreatedAt(new Date(2000));
    em.persist(fetchError2);

    em.persistAndFlush(new SubscriptionEntry(subscription));

    given(subscriptionService.valid("http://example.com"))
      .willReturn(true);

    em.clear();
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
      .andExpect(jsonPath("$.createdAt").value("1970-01-01T00:00:02.000+00:00"));
  }

  @Test
  void shouldDeleteSubscription() throws Exception {
    mockMvc.perform(delete("/api/2/subscriptions/{id}", subscription.getId()))
      .andExpect(status().isNoContent());

    assertThat(em.find(Subscription.class, subscription.getId())).isNull();
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
      .andExpect(jsonPath("$.content.length()", is(2)))
      .andExpect(jsonPath("$.content[0].message", is("message 2")))
      .andExpect(jsonPath("$.content[0].createdAt", is("1970-01-01T00:00:02.000+00:00")))
      .andExpect(jsonPath("$.content[1].message", is("message 1")))
      .andExpect(jsonPath("$.content[1].createdAt", is("1970-01-01T00:00:01.000+00:00")))
      .andExpect(jsonPath("$.page.totalElements", is(2)));
  }

  @Test
  void shouldNotReturnFetchErrorsIfSubscriptionContainsNoErrors() throws Exception {
    var subscription2 = em.persist(new Subscription("http://other.com", "irrelevant"));

    mockMvc.perform(get("/api/2/subscriptions/{id}/fetchError", subscription2.getId()))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.content.length()", is(0)))
      .andExpect(jsonPath("$.page.totalElements", is(0)));
  }
}
