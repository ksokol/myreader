package myreader.resource.subscription;

import myreader.entity.Feed;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionTag;
import myreader.test.ClearDb;
import myreader.test.WithTestProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureTestEntityManager;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import javax.transaction.Transactional;
import java.util.Date;

import static myreader.test.CustomMockMvcResultMatchers.validation;
import static myreader.test.request.JsonRequestPostProcessors.jsonBody;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.groups.Tuple.tuple;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
@AutoConfigureTestEntityManager
@Transactional
@ClearDb
@SpringBootTest
@WithMockUser
@WithTestProperties
class SubscriptionEntityResourceTests {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private TestEntityManager em;

  private Feed feed;
  private Subscription subscription1;
  private SubscriptionTag subscriptionTag;

  @BeforeEach
  void setUp() {
    feed = em.persistFlushFind(new Feed("http://example.com", "feed title"));

    subscription1 = new Subscription(feed);
    subscription1.setTitle("expected title");
    subscription1.setFetchCount(15);
    subscription1.setUnseen(10);
    subscription1.setCreatedAt(new Date(2000));
    subscription1 = em.persist(subscription1);

    subscriptionTag = new SubscriptionTag("subscriptiontag name", subscription1);
    subscriptionTag.setColor("#111111");
    subscriptionTag.setCreatedAt(new Date(1000));
    subscriptionTag = em.persist(subscriptionTag);
    subscription1.setSubscriptionTag(subscriptionTag);
  }

  @Test
  void shouldReturnResponse() throws Exception {
    mockMvc.perform(get("/api/2/subscriptions/{id}", subscription1.getId()))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.uuid", is(subscription1.getId().toString())))
      .andExpect(jsonPath("$.title", is("expected title")))
      .andExpect(jsonPath("$.sum", is(15)))
      .andExpect(jsonPath("$.unseen", is(10)))
      .andExpect(jsonPath("$.origin", is("http://example.com")))
      .andExpect(jsonPath("$.feedTag.uuid", is(subscriptionTag.getId().toString())))
      .andExpect(jsonPath("$.feedTag.name", is("subscriptiontag name")))
      .andExpect(jsonPath("$.feedTag.color", is("#111111")))
      .andExpect(jsonPath("$.feedTag.createdAt", is("1970-01-01T00:00:01.000+00:00")))
      .andExpect(jsonPath("$.createdAt", is("1970-01-01T00:00:02.000+00:00")));
  }

  @Test
  void shouldDeleteSubscription() throws Exception {
    mockMvc.perform(delete("/api/2/subscriptions/{id}", subscription1.getId()))
      .andExpect(status().isNoContent());

    assertThat(em.find(Subscription.class, subscription1.getId())).isNull();
  }

  @Test
  void shouldDeleteSubscriptionTagIfOrphaned() throws Exception {
    mockMvc.perform(delete("/api/2/subscriptions/{id}", subscription1.getId()))
      .andExpect(status().isNoContent());

    assertThat(em.find(SubscriptionTag.class, subscriptionTag.getId())).isNull();
  }

  @Test
  void shouldNotDeleteSubscriptionTagIfUsedInAnotherSubscription() throws Exception {
    var subscription2 = new Subscription(feed);
    subscription2.setTitle("expected title2");
    subscription2.setSubscriptionTag(subscriptionTag);
    em.persist(subscription2);

    mockMvc.perform(delete("/api/2/subscriptions/{id}", subscription1.getId()))
      .andExpect(status().isNoContent());

    assertThat(em.find(SubscriptionTag.class, subscriptionTag.getId())).isNotNull();
  }

  @Test
  void shouldReturnNotFoundWhenDeletingSubscriptionThatIsNotOwnedByCurrentUser() throws Exception {
    mockMvc.perform(patch("/api/2/subscriptions/9999")
      .with(jsonBody("{'title': 'irrelevant',  'tag' : 'irrelevant'}")))
      .andExpect(status().isNotFound());
  }

  @Test
  void shouldPatchSubscriptionTitleAndColor() throws Exception {
    mockMvc.perform(patch("/api/2/subscriptions/{id}", subscription1.getId())
      .with(jsonBody("{'title': 'changed title', 'feedTag': {'name': 'subscriptiontag name', 'color': '#222222'}}")))
      .andExpect(status().isOk())
      .andExpect(jsonPath("title", is("changed title")))
      .andExpect(jsonPath("feedTag.uuid", is(subscriptionTag.getId().toString())))
      .andExpect(jsonPath("feedTag.name", is("subscriptiontag name")))
      .andExpect(jsonPath("feedTag.color", is("#222222")));

    assertThat(em.find(Subscription.class, subscription1.getId()))
      .hasFieldOrPropertyWithValue("title", "changed title");
    assertThat(em.find(SubscriptionTag.class, subscriptionTag.getId()))
      .hasFieldOrPropertyWithValue("name", "subscriptiontag name")
      .hasFieldOrPropertyWithValue("color", "#222222");
  }

  @Test
  void shouldNotPatchIfNothingChanged() throws Exception {
    mockMvc.perform(patch("/api/2/subscriptions/{id}", subscription1.getId())
      .with(jsonBody("{'title': 'expected title', 'feedTag': {'name': 'subscriptiontag name'}}")))
      .andExpect(status().isOk())
      .andExpect(jsonPath("title", is("expected title")))
      .andExpect(jsonPath("feedTag.uuid", is(subscriptionTag.getId().toString())))
      .andExpect(jsonPath("feedTag.name", is("subscriptiontag name")))
      .andExpect(jsonPath("feedTag.color", is("#111111")));

    assertThat(em.find(Subscription.class, subscription1.getId()))
      .hasFieldOrPropertyWithValue("title", "expected title");
    assertThat(em.find(SubscriptionTag.class, subscriptionTag.getId()))
      .hasFieldOrPropertyWithValue("name", "subscriptiontag name")
      .hasFieldOrPropertyWithValue("color", "#111111");
  }

  @Test
  void shouldCreateNewSubscriptionTagAndDeleteOrphanedOneIfNameChanged() throws Exception {
    mockMvc.perform(patch("/api/2/subscriptions/{id}", subscription1.getId())
      .with(jsonBody("{'title': 'expected title', 'feedTag': {'name':'changed name', 'color': '#222222'}}")))
      .andExpect(status().isOk())
      .andExpect(jsonPath("title", is("expected title")))
      .andExpect(jsonPath("feedTag.uuid", is(not(subscriptionTag.getId().toString()))))
      .andExpect(jsonPath("feedTag.name", is("changed name")))
      .andExpect(jsonPath("feedTag.color", is("#222222")));

    assertThat(em.getEntityManager().createQuery("from SubscriptionTag", SubscriptionTag.class).getResultList())
      .hasSize(1)
      .extracting("name", "color")
      .contains(tuple("changed name", "#222222"));
  }

  @Test
  void shouldNotDeleteSubscriptionTagIfNotOrphanedAfterPatch() throws Exception {
    var subscription2 = new Subscription(feed);
    subscription2.setTitle("title");
    subscription2.setSubscriptionTag(subscriptionTag);
    em.persist(subscription2);

    mockMvc.perform(patch("/api/2/subscriptions/{id}", subscription1.getId())
      .with(jsonBody("{'title': 'expected title'}")))
      .andExpect(status().isOk())
      .andExpect(jsonPath("title", is("expected title")))
      .andExpect(jsonPath("feedTag", nullValue()));

    assertThat(em.find(SubscriptionTag.class, subscriptionTag.getId())).isNotNull();
  }

  @Test
  void shouldDeleteSubscriptionTagIfOrphanedAfterPatch() throws Exception {
    mockMvc.perform(patch("/api/2/subscriptions/{id}", subscription1.getId())
      .with(jsonBody("{'title': 'expected title'}")))
      .andExpect(status().isOk())
      .andExpect(jsonPath("title", is("expected title")))
      .andExpect(jsonPath("feedTag", nullValue()));

    assertThat(em.find(SubscriptionTag.class, subscriptionTag.getId())).isNull();
  }

  @Test
  void shouldRejectPatchRequestWhenTitleAndFeedTagNamePropertyAreAbsent() throws Exception {
    mockMvc.perform(patch("/api/2/subscriptions/{id}", subscription1.getId())
      .with(jsonBody("{'feedTag': {}}")))
      .andExpect(status().isBadRequest())
      .andExpect(validation().onField("title", is("may not be empty")))
      .andExpect(validation().onField("feedTag.name", is("may not be empty")));
  }

  @Test
  void shouldValidateSubscriptionTitle() throws Exception {
    mockMvc.perform(patch("/api/2/subscriptions/{id}", subscription1.getId())
      .with(jsonBody("{'title': ' '}")))
      .andExpect(status().isBadRequest())
      .andExpect(validation().onField("title", is("may not be empty")));
  }

  @Test
  void shouldValidateSubscriptionTagName() throws Exception {
    mockMvc.perform(patch("/api/2/subscriptions/{id}", subscription1.getId())
      .with(jsonBody("{'title': 'irrelevant', 'feedTag': {'name': ' '}}")))
      .andExpect(status().isBadRequest())
      .andExpect(validation().onField("feedTag.name", is("may not be empty")));
  }
}
