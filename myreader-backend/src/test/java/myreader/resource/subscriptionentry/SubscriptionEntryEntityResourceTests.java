package myreader.resource.subscriptionentry;

import myreader.entity.Feed;
import myreader.entity.FeedEntry;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.entity.SubscriptionTag;
import myreader.test.ClearDb;
import myreader.test.TestUser;
import myreader.test.WithAuthenticatedUser;
import myreader.test.WithTestProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureTestEntityManager;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.Set;

import static myreader.test.TestUser.USER4;
import static myreader.test.request.JsonRequestPostProcessors.jsonBody;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
@AutoConfigureTestEntityManager
@Transactional
@ClearDb
@SpringBootTest
@WithAuthenticatedUser(TestUser.USER4)
@WithTestProperties
class SubscriptionEntryEntityResourceTests {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private TestEntityManager em;

  private Subscription subscription;
  private SubscriptionEntry subscriptionEntry;

  @BeforeEach
  void before() {
    var user = em.persist(USER4.toUser());
    var feed = em.persist(new Feed("http://example.com", "feed title"));

    var feedEntry = new FeedEntry(feed);
    feedEntry.setTitle("Bliki: TellDontAsk");
    feedEntry.setContent("content");
    feedEntry.setUrl("http://martinfowler.com/bliki/TellDontAsk.html");
    feedEntry = em.persist(feedEntry);

    subscription = new Subscription(user, feed);
    subscription.setTitle("user112_subscription1");
    subscription = em.persist(subscription);

    subscriptionEntry = new SubscriptionEntry(subscription, feedEntry);
    subscriptionEntry.setTags(Set.of("tag3"));
    subscriptionEntry.setSeen(true);
    subscriptionEntry.setCreatedAt(new Date(1000));
    subscriptionEntry.setFeedEntry(feedEntry);
    subscriptionEntry = em.persist(subscriptionEntry);

    var subscriptionTag = new SubscriptionTag("tag1", user);
    subscription.setSubscriptionTag(subscriptionTag);
    subscriptionTag.setColor("#777");
    em.persist(subscriptionTag);
  }

  @Test
  void shouldOnlyChangeTag() throws Exception {
    mockMvc.perform(patch("/api/2/subscriptionEntries/{id}", subscriptionEntry.getId())
      .with(jsonBody("{'tags': ['tag-patched']}")))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.uuid").value(subscriptionEntry.getId().toString()))
      .andExpect(jsonPath("$.title").value("Bliki: TellDontAsk"))
      .andExpect(jsonPath("$.feedTitle").value("user112_subscription1"))
      .andExpect(jsonPath("$.tags").value("tag-patched"))
      .andExpect(jsonPath("$.content").value("content"))
      .andExpect(jsonPath("$.seen").value(true))
      .andExpect(jsonPath("$.feedTag").value("tag1"))
      .andExpect(jsonPath("$.feedTagColor").value("#777"))
      .andExpect(jsonPath("$.feedUuid").value(subscription.getId().toString()))
      .andExpect(jsonPath("$.origin").value("http://martinfowler.com/bliki/TellDontAsk.html"))
      .andExpect(jsonPath("$.createdAt").value("1970-01-01T00:00:01.000+00:00"));

    assertThat(em.find(SubscriptionEntry.class, subscriptionEntry.getId()))
      .hasFieldOrPropertyWithValue("seen", true)
      .hasFieldOrPropertyWithValue("tags", Set.of("tag-patched"));
  }

  @Test
  void shouldChangeTagAndSeenFlag() throws Exception {
    mockMvc.perform(patch("/api/2/subscriptionEntries/{id}", subscriptionEntry.getId())
      .with(jsonBody("{'tags': ['tag-patched'], 'seen': false}")))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.uuid").value(subscriptionEntry.getId().toString()))
      .andExpect(jsonPath("$.title").value("Bliki: TellDontAsk"))
      .andExpect(jsonPath("$.feedTitle").value("user112_subscription1"))
      .andExpect(jsonPath("$.tags").value("tag-patched"))
      .andExpect(jsonPath("$.content").value("content"))
      .andExpect(jsonPath("$.seen").value(false))
      .andExpect(jsonPath("$.feedTag").value("tag1"))
      .andExpect(jsonPath("$.feedTagColor").value("#777"))
      .andExpect(jsonPath("$.feedUuid").value(subscription.getId().toString()))
      .andExpect(jsonPath("$.origin").value("http://martinfowler.com/bliki/TellDontAsk.html"))
      .andExpect(jsonPath("$.createdAt").value("1970-01-01T00:00:01.000+00:00"));

    assertThat(em.find(SubscriptionEntry.class, subscriptionEntry.getId()))
      .hasFieldOrPropertyWithValue("seen", false)
      .hasFieldOrPropertyWithValue("tags", Set.of("tag-patched"));
  }
}
