package myreader.resource.subscriptionentry;

import com.jayway.jsonpath.JsonPath;
import myreader.entity.Feed;
import myreader.entity.FeedEntry;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.entity.User;
import myreader.test.ClearDb;
import myreader.test.TestUser;
import myreader.test.WithAuthenticatedUser;
import myreader.test.WithTestProperties;
import org.hibernate.search.jpa.Search;
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
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Set;

import static myreader.test.TestUser.USER1;
import static myreader.test.TestUser.USER4;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
@AutoConfigureTestEntityManager
@Transactional(propagation = Propagation.SUPPORTS)
@ClearDb
@SpringBootTest
@WithTestProperties
class SubscriptionEntryCollectionResourceTests {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private TestEntityManager em;

  @Autowired
  private TransactionTemplate tx;

  private User user1;
  private User user2;
  private Subscription user1Subscription;
  private Subscription user2Subscription;
  private SubscriptionEntry user1SubscriptionEntry2;
  private SubscriptionEntry user1SubscriptionEntry3;
  private SubscriptionEntry user1SubscriptionEntry4;
  private SubscriptionEntry user2SubscriptionEntry;

  @BeforeEach
  void setUp() {
    tx.execute(status -> {
      user1 = em.persist(USER1.toUser());
      user2 = em.persist(USER4.toUser());

      var feed1 = em.persist(new Feed("irrelevant", "irrelevant"));
      var feed2 = em.persist(new Feed("irrelevant", "irrelevant"));

      user1Subscription = new Subscription(user1, feed1);
      user1Subscription.setTitle("user1 subscription1");
      user1Subscription = em.persist(user1Subscription);

      user2Subscription = new Subscription(user2, feed2);
      user2Subscription.setTitle("user2 subscription1");
      user2Subscription = em.persist(user2Subscription);

      var feedEntry1 = new FeedEntry(feed1);
      feedEntry1.setTitle("some entry1 title");
      feedEntry1.setContent("some entry1 content");
      feedEntry1 = em.persistAndFlush(feedEntry1);

      var feedEntry2 = new FeedEntry(feed1);
      feedEntry2.setTitle("some entry2 title");
      feedEntry2.setContent("some entry2 content");
      feedEntry2.setUrl("http://example.com/feedentry2");
      feedEntry2 = em.persistAndFlush(feedEntry2);

      var feedEntry3 = new FeedEntry(feed1);
      feedEntry3.setTitle("some entry3 title");
      feedEntry3.setContent("some entry3 content");
      feedEntry3 = em.persistAndFlush(feedEntry3);

      var feedEntry4 = new FeedEntry(feed1);
      feedEntry4.setTitle("some entry4 title");
      feedEntry4.setContent("some entry4 content");
      feedEntry4.setUrl("http://example.com/feedentry4");
      feedEntry4.setCreatedAt(new Date(1000));
      feedEntry4 = em.persistAndFlush(feedEntry4);

      var subscriptionEntry1 = new SubscriptionEntry(user1Subscription, feedEntry1);
      subscriptionEntry1.setTags(Set.of("tag1", "tag2", "tag3"));
      subscriptionEntry1.setSeen(true);
      subscriptionEntry1.setCreatedAt(new Date(1000));

      var subscriptionEntry2 = new SubscriptionEntry(user2Subscription, feedEntry2);
      subscriptionEntry2.setTags(Set.of("tag2-tag3", "tag4 tag5", "tag6,tag7", "tag8Tag9"));
      subscriptionEntry2.setCreatedAt(new Date(2000));

      var subscriptionEntry4 = new SubscriptionEntry(user1Subscription, feedEntry4);
      subscriptionEntry4.setCreatedAt(new Date(4000));

      em.persistAndFlush(subscriptionEntry1);
      user1SubscriptionEntry2 = em.persistAndFlush(new SubscriptionEntry(user1Subscription, feedEntry2));
      user1SubscriptionEntry3 = em.persistAndFlush(new SubscriptionEntry(user1Subscription, feedEntry3));
      user1SubscriptionEntry4 = em.persistAndFlush(subscriptionEntry4);
      user2SubscriptionEntry = em.persistAndFlush(subscriptionEntry2);
      return null;
    });

    tx.execute(s -> {
      try {
        Search.getFullTextEntityManager(em.getEntityManager()).createIndexer().startAndWait();
      } catch (InterruptedException exception) {
        throw new AssertionError(exception);
      }
      return null;
    });
  }

  @Test
  @WithAuthenticatedUser(TestUser.USER1)
  void shouldReturnEntriesForUser1() throws Exception {
    mockMvc.perform(get("/api/2/subscriptionEntries?size=3"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("links[?(@.rel=='self')].href").value("http://localhost/api/2/subscriptionEntries?size=3"))
      .andExpect(jsonPath("links[?(@.rel=='next')].href").value("http://localhost/api/2/subscriptionEntries?size=3&next=" + user1SubscriptionEntry2.getId()))
      .andExpect(jsonPath("$.content.length()").value(3))
      .andExpect(jsonPath("$.content[0].uuid").value(user1SubscriptionEntry4.getId().toString()))
      .andExpect(jsonPath("$.content[0].title").value("some entry4 title"))
      .andExpect(jsonPath("$.content[0].feedTitle").value("user1 subscription1"))
      .andExpect(jsonPath("$.content[0].tags").isEmpty())
      .andExpect(jsonPath("$.content[0].content").value("some entry4 content"))
      .andExpect(jsonPath("$.content[0].seen").value(false))
      .andExpect(jsonPath("$.content[0].feedTag").doesNotExist())
      .andExpect(jsonPath("$.content[0].feedTagColor").doesNotExist())
      .andExpect(jsonPath("$.content[0].feedUuid").value(user1Subscription.getId().toString()))
      .andExpect(jsonPath("$.content[0].origin").value("http://example.com/feedentry4"))
      .andExpect(jsonPath("$.content[0].createdAt").value("1970-01-01T00:00:04.000+00:00"))
      .andExpect(jsonPath("$.content[1].uuid").value(user1SubscriptionEntry3.getId().toString()))
      .andExpect(jsonPath("$.content[2].uuid").value(user1SubscriptionEntry2.getId().toString()))
      .andExpect(jsonPath("$.page").isEmpty());
  }

  @Test
  @WithAuthenticatedUser(TestUser.USER4)
  void shouldReturnEntriesForUser4() throws Exception {
    mockMvc.perform(get("/api/2/subscriptionEntries"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.content[0].uuid").value(user2SubscriptionEntry.getId().toString()))
      .andExpect(jsonPath("$.content[0].title").value("some entry2 title"))
      .andExpect(jsonPath("$.content[0].feedTitle").value("user2 subscription1"))
      .andExpect(jsonPath("$.content[0].tags").value(list("tag2-tag3", "tag4 tag5", "tag6,tag7", "tag8Tag9")))
      .andExpect(jsonPath("$.content[0].content").value("some entry2 content"))
      .andExpect(jsonPath("$.content[0].seen").value(false))
      .andExpect(jsonPath("$.content[0].feedTag").doesNotExist())
      .andExpect(jsonPath("$.content[0].feedTagColor").doesNotExist())
      .andExpect(jsonPath("$.content[0].feedUuid").value(user2Subscription.getId().toString()))
      .andExpect(jsonPath("$.content[0].origin").value("http://example.com/feedentry2"))
      .andExpect(jsonPath("$.content[0].createdAt").value("1970-01-01T00:00:02.000+00:00"))
      .andExpect(jsonPath("$.content.length()").value(1))
      .andExpect(jsonPath("$.page").isEmpty());
  }

  @Test
  @WithAuthenticatedUser(TestUser.USER1)
  void searchWithPageSizeOne() throws Exception {
    mockMvc.perform(get("/api/2/subscriptionEntries?size=1"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.content.length()").value(1))
      .andExpect(jsonPath("$.content[0].uuid").value(user1SubscriptionEntry4.getId().toString()));
  }

  @Test
  @WithAuthenticatedUser(TestUser.USER1)
  void searchSubscriptionEntryByTitle() throws Exception {
    mockMvc.perform(get("/api/2/subscriptionEntries?q=entry4"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.content.length()").value(1))
      .andExpect(jsonPath("$.content[0].uuid").value(user1SubscriptionEntry4.getId().toString()));
  }

  @Test
  @WithAuthenticatedUser(TestUser.USER1)
  void shouldPaginate() throws Exception {
    var firstResponse = mockMvc.perform(get("/api/2/subscriptionEntries?size=2"))
      .andExpect(jsonPath("links[?(@.rel=='next')].href").value("http://localhost/api/2/subscriptionEntries?size=2&next=" + user1SubscriptionEntry3.getId()))
      .andExpect(jsonPath("content[0].uuid").value(user1SubscriptionEntry4.getId().toString()))
      .andExpect(jsonPath("content[1].uuid").value(user1SubscriptionEntry3.getId().toString()))
      .andReturn();

    mockMvc.perform(get(nextPage(firstResponse)))
      .andExpect(jsonPath("links[?(@.rel=='self')].href").value("http://localhost/api/2/subscriptionEntries?size=2"))
      .andExpect(jsonPath("links[?(@.rel=='self')].next").doesNotExist())
      .andExpect(jsonPath("content[0].uuid").value(user1SubscriptionEntry2.getId().toString()));
  }

  @Test
  @WithAuthenticatedUser(TestUser.USER1)
  @Transactional(propagation = Propagation.NOT_SUPPORTED)
  void shouldFindTagsForUser1() throws Exception {
    mockMvc.perform(get("/api/2/subscriptionEntries/availableTags"))
      .andExpect(jsonPath("$").value(list("tag1", "tag2", "tag3")));
  }

  @Test
  @WithAuthenticatedUser(TestUser.USER4)
  @Transactional(propagation = Propagation.NOT_SUPPORTED)
  void shouldFindTagsForGivenUser4() throws Exception {
    mockMvc.perform(get("/api/2/subscriptionEntries/availableTags"))
      .andExpect(jsonPath("$").value(list("tag2-tag3", "tag4 tag5", "tag6,tag7", "tag8Tag9")));
  }

  private String nextPage(MvcResult mvcResult) throws IOException {
    List<String> nextHrefs = JsonPath.read(mvcResult.getResponse().getContentAsString(), "$.links[?(@.rel=='next')].href");
    if (nextHrefs.size() == 0) {
      throw new AssertionError("href with rel next not found");
    }
    return nextHrefs.get(0);
  }

  private List<String> list(String...values) {
    List<String> valueList = new ArrayList<>();
    Collections.addAll(valueList, values);
    return valueList;
  }
}
