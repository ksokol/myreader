package myreader.resource.subscriptionentry;

import com.jayway.jsonpath.JsonPath;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.entity.SubscriptionTag;
import myreader.test.WithTestProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.opentest4j.AssertionFailedError;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureTestEntityManager;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
@AutoConfigureTestEntityManager
@Transactional
@SpringBootTest
@WithMockUser
@WithTestProperties
class SubscriptionEntryCollectionResourceTests {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private TestEntityManager em;

  private Subscription subscription1;
  private Subscription subscription2;
  private SubscriptionEntry subscriptionEntry1;
  private SubscriptionEntry subscriptionEntry2;
  private SubscriptionEntry subscriptionEntry3;
  private SubscriptionEntry subscriptionEntry4;

  @BeforeEach
  void setUp() {
    subscription1 = new Subscription("irrelevant", "irrelevant");
    subscription1.setTitle("user1 subscription1");
    subscription1 = em.persist(subscription1);

    subscription2 = new Subscription("irrelevant", "irrelevant");
    subscription2.setTitle("user2 subscription1");
    subscription2 = em.persist(subscription2);

    var subscriptionTag2 = new SubscriptionTag("subscription tag", subscription2);
    subscriptionTag2 = em.persist(subscriptionTag2);
    subscription2.setSubscriptionTag(subscriptionTag2);
    subscription2 = em.persist(subscription2);

    subscriptionEntry1 = new SubscriptionEntry(subscription1);
    subscriptionEntry1.setTitle("some entry1 title");
    subscriptionEntry1.setContent("some entry1 content");
    subscriptionEntry1.setTags(Set.of("tag1", "tag2", "tag3"));
    subscriptionEntry1.setSeen(true);
    subscriptionEntry1.setCreatedAt(new Date(1000));
    subscriptionEntry1 = em.persistAndFlush(subscriptionEntry1);

    subscriptionEntry2 = new SubscriptionEntry(subscription2);
    subscriptionEntry2.setTitle("some entry2 title");
    subscriptionEntry2.setContent("some entry2 content");
    subscriptionEntry2.setUrl("http://example.com/feedentry2");
    subscriptionEntry2.setTags(Set.of("tag2-tag3", "tag4 tag5", "tag6,tag7", "tag8Tag9"));
    subscriptionEntry2.setCreatedAt(new Date(2000));
    subscriptionEntry2 = em.persistAndFlush(subscriptionEntry2);

    subscriptionEntry3 = new SubscriptionEntry(subscription1);
    subscriptionEntry3.setTitle("some entry3 title");
    subscriptionEntry3.setContent("some entry3 content");
    subscriptionEntry3 = em.persistAndFlush(subscriptionEntry3);

    subscriptionEntry4 = new SubscriptionEntry(subscription1);
    subscriptionEntry4.setTitle("some entry4 title");
    subscriptionEntry4.setContent("some entry4 content");
    subscriptionEntry4.setUrl("http://example.com/feedentry4");
    subscriptionEntry4.setCreatedAt(new Date(4000));
    subscriptionEntry4 = em.persistAndFlush(subscriptionEntry4);
  }

  @Test
  void shouldReturnEntries() throws Exception {
    mockMvc.perform(get("/api/2/subscriptionEntries?size=3"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("links[?(@.rel=='self')].href").value("http://localhost/api/2/subscriptionEntries?size=3"))
      .andExpect(jsonPath("links[?(@.rel=='next')].href").value("http://localhost/api/2/subscriptionEntries?size=3&next=" + subscriptionEntry2.getId()))
      .andExpect(jsonPath("$.content.length()").value(3))
      .andExpect(jsonPath("$.content[0].uuid").value(subscriptionEntry4.getId().toString()))
      .andExpect(jsonPath("$.content[0].title").value("some entry4 title"))
      .andExpect(jsonPath("$.content[0].feedTitle").value("user1 subscription1"))
      .andExpect(jsonPath("$.content[0].tags").isEmpty())
      .andExpect(jsonPath("$.content[0].content").value("some entry4 content"))
      .andExpect(jsonPath("$.content[0].seen").value(false))
      .andExpect(jsonPath("$.content[0].feedTag").doesNotExist())
      .andExpect(jsonPath("$.content[0].feedTagColor").doesNotExist())
      .andExpect(jsonPath("$.content[0].feedUuid").value(subscription1.getId().toString()))
      .andExpect(jsonPath("$.content[0].origin").value("http://example.com/feedentry4"))
      .andExpect(jsonPath("$.content[0].createdAt").value("1970-01-01T00:00:04.000+00:00"))
      .andExpect(jsonPath("$.content[1].uuid").value(subscriptionEntry3.getId().toString()))
      .andExpect(jsonPath("$.content[2].uuid").value(subscriptionEntry2.getId().toString()))
      .andExpect(jsonPath("$.page").isEmpty());
  }

  @Test
  void searchWithPageSizeOne() throws Exception {
    mockMvc.perform(get("/api/2/subscriptionEntries?size=1"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.content.length()").value(1))
      .andExpect(jsonPath("$.content[0].uuid").value(subscriptionEntry4.getId().toString()));
  }

  @Test
  void shouldPaginate() throws Exception {
    var firstResponse = mockMvc.perform(get("/api/2/subscriptionEntries?size=2"))
      .andExpect(jsonPath("links[?(@.rel=='next')].href").value("http://localhost/api/2/subscriptionEntries?size=2&next=" + subscriptionEntry3.getId()))
      .andExpect(jsonPath("content[0].uuid").value(subscriptionEntry4.getId().toString()))
      .andExpect(jsonPath("content[1].uuid").value(subscriptionEntry3.getId().toString()))
      .andReturn();

    mockMvc.perform(get(nextPage(firstResponse)))
      .andExpect(jsonPath("links[?(@.rel=='self')].href").value("http://localhost/api/2/subscriptionEntries?size=2"))
      .andExpect(jsonPath("links[?(@.rel=='self')].next").doesNotExist())
      .andExpect(jsonPath("content[0].uuid").value(subscriptionEntry2.getId().toString()));
  }

  @Test
  void shouldFindTags() throws Exception {
    mockMvc.perform(get("/api/2/subscriptionEntries/availableTags"))
      .andExpect(jsonPath("$").value(list("tag1", "tag2", "tag2-tag3", "tag3", "tag4 tag5", "tag6,tag7", "tag8Tag9")));
  }

  @Test
  void shouldFilterByEntryTags2AndTag3() throws Exception {
    mockMvc.perform(get("/api/2/subscriptionEntries?entryTagEqual=tag2"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.content.length()").value(1))
      .andExpect(jsonPath("$.content[0].uuid").value(subscriptionEntry1.getId().toString()));

    mockMvc.perform(get("/api/2/subscriptionEntries?entryTagEqual=tag2-tag3"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.content.length()").value(1))
      .andExpect(jsonPath("$.content[0].uuid").value(subscriptionEntry2.getId().toString()));
  }

  @Test
  void shouldFilterByEntryTag4() throws Exception {
    mockMvc.perform(get("/api/2/subscriptionEntries?entryTagEqual=tag4"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.content.length()").value(0));

    mockMvc.perform(get("/api/2/subscriptionEntries?entryTagEqual=tag4 tag5"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.content.length()").value(1))
      .andExpect(jsonPath("$.content[0].uuid").value(subscriptionEntry2.getId().toString()));
  }

  @Test
  void shouldFilterByEntryTag6AndTag7() throws Exception {
    mockMvc.perform(get("/api/2/subscriptionEntries?entryTagEqual=tag6"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.content.length()").value(0));

    mockMvc.perform(get("/api/2/subscriptionEntries?entryTagEqual=tag6,tag7"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.content.length()").value(1))
      .andExpect(jsonPath("$.content[0].uuid").value(subscriptionEntry2.getId().toString()));
  }

  @Test
  void shouldFilterByEntryTag8AndTag9() throws Exception {
    mockMvc.perform(get("/api/2/subscriptionEntries?entryTagEqual=tag8"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.content.length()").value(0));

    mockMvc.perform(get("/api/2/subscriptionEntries?entryTagEqual=tag8Tag9"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.content.length()").value(1))
      .andExpect(jsonPath("$.content[0].uuid").value(subscriptionEntry2.getId().toString()));
  }

  @Test
  void feedUuidEqualSubscription1() throws Exception {
    mockMvc.perform(get("/api/2/subscriptionEntries?feedUuidEqual={id}", subscription1.getId()))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.content.length()").value(3))
      .andExpect(jsonPath("$.content[0].uuid").value(subscriptionEntry4.getId().toString()))
      .andExpect(jsonPath("$.content[1].uuid").value(subscriptionEntry3.getId().toString()))
      .andExpect(jsonPath("$.content[2].uuid").value(subscriptionEntry1.getId().toString()));
  }

  @Test
  void feedUuidEqualSubscription2() throws Exception {
    mockMvc.perform(get("/api/2/subscriptionEntries?feedUuidEqual={id}", subscription2.getId()))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.content.length()").value(1))
      .andExpect(jsonPath("$.content[0].uuid").value(subscriptionEntry2.getId().toString()));
  }

  @Test
  void seenEqualFalse() throws Exception {
    mockMvc.perform(get("/api/2/subscriptionEntries?seenEqual=true"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.content.length()").value(1))
      .andExpect(jsonPath("$.content[0].uuid").value(subscriptionEntry1.getId().toString()));
  }

  @Test
  void seenEqualWildcard() throws Exception {
    mockMvc.perform(get("/api/2/subscriptionEntries?seenEqual=false"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.content.length()").value(3))
      .andExpect(jsonPath("$.content[0].uuid").value(subscriptionEntry4.getId().toString()))
      .andExpect(jsonPath("$.content[1].uuid").value(subscriptionEntry3.getId().toString()))
      .andExpect(jsonPath("$.content[2].uuid").value(subscriptionEntry2.getId().toString()));
  }

  @Test
  void shouldValidateSeenEqual() throws Exception {
      mockMvc.perform(get("/api/2/subscriptionEntries?seenEqual=invalid"))
        .andExpect(status().isBadRequest())
        .andExpect(result -> {
          String actual = Optional.ofNullable(result.getResolvedException()).orElseThrow(AssertionFailedError::new).getMessage();
          assertEquals("seenEqual is not of type boolean", actual);
        });
  }

  @Test
  void feedTagEqual() throws Exception {
    mockMvc.perform(get("/api/2/subscriptionEntries?feedTagEqual=subscription tag"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.content.length()").value(1))
      .andExpect(jsonPath("$.content[0].uuid").value(subscriptionEntry2.getId().toString()));
  }

  @Test
  void feedTagEqualUnknown() throws Exception {
    mockMvc.perform(get("/api/2/subscriptionEntries?feedTagEqual=unknown"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.content.length()").value(0));
  }

  @Test
  void shouldPaginateWithChangingSeenValues() throws Exception {
    mockMvc.perform(get("/api/2/subscriptionEntries?size=2&seenEqual=false"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.content.length()").value(2))
      .andExpect(jsonPath("$.content[0].uuid").value(subscriptionEntry4.getId().toString()))
      .andExpect(jsonPath("$.content[0].seen").value(false))
      .andExpect(jsonPath("$.content[1].uuid").value(subscriptionEntry3.getId().toString()))
      .andExpect(jsonPath("$.content[1].seen").value(false));

    subscriptionEntry4 = em.find(SubscriptionEntry.class, subscriptionEntry4.getId());
    subscriptionEntry4.setSeen(true);
    em.persistFlushFind(subscriptionEntry4);

    mockMvc.perform(get("/api/2/subscriptionEntries?size=10"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.content.length()").value(4))
      .andExpect(jsonPath("$.content[0].uuid").value(subscriptionEntry4.getId().toString()))
      .andExpect(jsonPath("$.content[0].seen").value(true))
      .andExpect(jsonPath("$.content[1].uuid").value(subscriptionEntry3.getId().toString()))
      .andExpect(jsonPath("$.content[1].seen").value(false))
      .andExpect(jsonPath("$.content[2].uuid").value(subscriptionEntry2.getId().toString()))
      .andExpect(jsonPath("$.content[2].seen").value(false))
      .andExpect(jsonPath("$.content[3].uuid").value(subscriptionEntry1.getId().toString()))
      .andExpect(jsonPath("$.content[3].seen").value(true));

    mockMvc.perform(get("/api/2/subscriptionEntries?size=2&next={id}&seenEqual=false", subscriptionEntry4.getId()))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.content.length()").value(2))
      .andExpect(jsonPath("$.content[0].uuid").value(subscriptionEntry3.getId().toString()))
      .andExpect(jsonPath("$.content[1].uuid").value(subscriptionEntry2.getId().toString()));

    subscriptionEntry2 = em.find(SubscriptionEntry.class, subscriptionEntry2.getId());
    subscriptionEntry2.setSeen(true);
    em.persistFlushFind(subscriptionEntry2);

    mockMvc.perform(get("/api/2/subscriptionEntries?size=10"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.content.length()").value(4))
      .andExpect(jsonPath("$.content[0].uuid").value(subscriptionEntry4.getId().toString()))
      .andExpect(jsonPath("$.content[0].seen").value(true))
      .andExpect(jsonPath("$.content[1].uuid").value(subscriptionEntry3.getId().toString()))
      .andExpect(jsonPath("$.content[1].seen").value(false))
      .andExpect(jsonPath("$.content[2].uuid").value(subscriptionEntry2.getId().toString()))
      .andExpect(jsonPath("$.content[2].seen").value(true))
      .andExpect(jsonPath("$.content[3].uuid").value(subscriptionEntry1.getId().toString()))
      .andExpect(jsonPath("$.content[3].seen").value(true));

    mockMvc.perform(get("/api/2/subscriptionEntries?size=2&next={id}&seenEqual=false", subscriptionEntry2.getId()))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.content.length()").value(0));
  }

  @Test
  void shouldnotReturnExcludedEntries() throws Exception {
    var subscriptionEntry5 = new SubscriptionEntry(subscription1);
    subscriptionEntry5.setTitle("some entry5 title");
    subscriptionEntry5.setContent("some entry5 content");
    subscriptionEntry5.setUrl("http://example.com/feedentry5");
    subscriptionEntry5.setExcluded(true);
    subscriptionEntry5.setCreatedAt(new Date(5000));
    em.persistAndFlush(subscriptionEntry5);

    mockMvc.perform(get("/api/2/subscriptionEntries?size=3"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.content.length()").value(3))
      .andExpect(jsonPath("$.content[0].uuid").value(subscriptionEntry4.getId().toString()))
      .andExpect(jsonPath("$.content[1].uuid").value(subscriptionEntry3.getId().toString()))
      .andExpect(jsonPath("$.content[2].uuid").value(subscriptionEntry2.getId().toString()));
  }

  private String nextPage(MvcResult mvcResult) throws IOException {
    List<String> nextHrefs = JsonPath.read(mvcResult.getResponse().getContentAsString(), "$.links[?(@.rel=='next')].href");
    if (nextHrefs.size() == 0) {
      throw new AssertionError("href with rel next not found");
    }
    return nextHrefs.get(0);
  }

  private List<String> list(String... values) {
    List<String> valueList = new ArrayList<>();
    Collections.addAll(valueList, values);
    return valueList;
  }
}
