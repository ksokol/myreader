package myreader.resource.subscriptionentry;

import com.jayway.jsonpath.JsonPath;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.test.WithTestProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.opentest4j.AssertionFailedError;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.jdbc.core.JdbcAggregateOperations;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcOperations;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import static myreader.test.OffsetDateTimes.ofEpochMilli;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
@Transactional
@SpringBootTest
@WithMockUser
@WithTestProperties
class SubscriptionEntryCollectionResourceTests {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private JdbcAggregateOperations template;

  @Autowired
  private NamedParameterJdbcOperations jdbcTemplate;

  private Subscription subscription1;
  private Subscription subscription2;
  private SubscriptionEntry subscriptionEntry1;
  private SubscriptionEntry subscriptionEntry2;
  private SubscriptionEntry subscriptionEntry3;
  private SubscriptionEntry subscriptionEntry4;
  private SubscriptionEntry subscriptionEntry6;
  private SubscriptionEntry subscriptionEntry7;
  private SubscriptionEntry subscriptionEntry8;
  private SubscriptionEntry subscriptionEntry9;
  private SubscriptionEntry subscriptionEntry10;
  private SubscriptionEntry subscriptionEntry11;
  private SubscriptionEntry subscriptionEntry12;

  private int counter;

  @BeforeEach
  void setUp() {
    subscription1 = template.save(new Subscription(
      "irrelevant",
      "user1 subscription1",
      null,
      null,
      0,
      null,
      0,
      null,
      false,
      ofEpochMilli(1000)
    ));

    subscription2 = template.save(new Subscription(
      "irrelevant",
      "user2 subscription1",
      "subscription tag",
      null,
      0,
      null,
      0,
      null,
      false,
      ofEpochMilli(1000)
    ));

    subscriptionEntry1 = createEntry(subscription1);
    subscriptionEntry1.setTags(Set.of("tag1", "tag2", "tag3"));
    subscriptionEntry1.setSeen(true);
    subscriptionEntry1 = template.save(subscriptionEntry1);

    subscriptionEntry2 = createEntry(subscription2);
    subscriptionEntry2.setTags(Set.of("tag2-tag3", "tag4 tag5", "tag6,tag7", "tag8Tag9"));
    subscriptionEntry2 = template.save(subscriptionEntry2);

    subscriptionEntry3 = createEntry(subscription1);
    subscriptionEntry4 = createEntry(subscription1);

    createEntry(subscription1, true);

    subscriptionEntry6 = createEntry(subscription1);
    subscriptionEntry7 = createEntry(subscription1);
    subscriptionEntry8 = createEntry(subscription1);
    subscriptionEntry9 = createEntry(subscription1);
    subscriptionEntry10 = createEntry(subscription1);
    subscriptionEntry11 = createEntry(subscription1);
    subscriptionEntry12 = createEntry(subscription1);
  }

  @Test
  void shouldReturnEntries() throws Exception {
    mockMvc.perform(get("/api/2/subscriptionEntries"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.nextPage.uuid").value(subscriptionEntry2.getId()))
      .andExpect(jsonPath("$.content.length()").value(10))
      .andExpect(jsonPath("$.content[0].uuid").value(subscriptionEntry12.getId().toString()))
      .andExpect(jsonPath("$.content[1].uuid").value(subscriptionEntry11.getId().toString()))
      .andExpect(jsonPath("$.content[2].uuid").value(subscriptionEntry10.getId().toString()))
      .andExpect(jsonPath("$.content[3].uuid").value(subscriptionEntry9.getId().toString()))
      .andExpect(jsonPath("$.content[4].uuid").value(subscriptionEntry8.getId().toString()))
      .andExpect(jsonPath("$.content[5].uuid").value(subscriptionEntry7.getId().toString()))
      .andExpect(jsonPath("$.content[6].uuid").value(subscriptionEntry6.getId().toString()))
      .andExpect(jsonPath("$.content[7].uuid").value(subscriptionEntry4.getId().toString()))
      .andExpect(jsonPath("$.content[7].uuid").value(subscriptionEntry4.getId().toString()))
      .andExpect(jsonPath("$.content[7].title").value("some entry4 title"))
      .andExpect(jsonPath("$.content[7].feedTitle").value("user1 subscription1"))
      .andExpect(jsonPath("$.content[7].tags").isEmpty())
      .andExpect(jsonPath("$.content[7].content").value("some entry4 content"))
      .andExpect(jsonPath("$.content[7].seen").value(false))
      .andExpect(jsonPath("$.content[7].feedTag").isEmpty())
      .andExpect(jsonPath("$.content[7].feedTagColor").isEmpty())
      .andExpect(jsonPath("$.content[7].feedUuid").value(subscription1.getId().toString()))
      .andExpect(jsonPath("$.content[7].origin").value("http://example.com/feedentry4"))
      .andExpect(jsonPath("$.content[7].createdAt").value("1970-01-01T00:00:04Z"))
      .andExpect(jsonPath("$.content[8].uuid").value(subscriptionEntry3.getId().toString()))
      .andExpect(jsonPath("$.content[9].uuid").value(subscriptionEntry2.getId().toString()));
  }

  @Test
  void shouldPaginate() throws Exception {
    var firstResponse = mockMvc.perform(get("/api/2/subscriptionEntries"))
      .andExpect(jsonPath("nextPage.uuid").value(subscriptionEntry2.getId()))
      .andExpect(jsonPath("content[0].uuid").value(subscriptionEntry12.getId().toString()))
      .andExpect(jsonPath("content[9].uuid").value(subscriptionEntry2.getId().toString()))
      .andReturn();

    mockMvc.perform(get(nextPage(firstResponse)))
      .andExpect(jsonPath("$.content.length()").value(1))
      .andExpect(jsonPath("nextPage").doesNotExist())
      .andExpect(jsonPath("content[0].uuid").value(subscriptionEntry1.getId().toString()));
  }

  @Test
  void shouldFilterByEntryTags2AndTag3() throws Exception {
    mockMvc.perform(get("/api/2/subscriptionEntries?entryTagEqual=tag2"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.content.length()").value(1))
      .andExpect(jsonPath("$.content[0].uuid").value(subscriptionEntry1.getId().toString()));

    mockMvc.perform(get("/api/2/subscriptionEntries?entryTagEqual=tag2-tag3"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.nextPage").doesNotExist())
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
      .andExpect(jsonPath("$.nextPage").doesNotExist())
      .andExpect(jsonPath("$.content.length()").value(1))
      .andExpect(jsonPath("$.content[0].uuid").value(subscriptionEntry2.getId().toString()));
  }

  @Test
  void shouldFilterByEntryTag6AndTag7() throws Exception {
    mockMvc.perform(get("/api/2/subscriptionEntries?entryTagEqual=tag6"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.nextPage").doesNotExist())
      .andExpect(jsonPath("$.content.length()").value(0));

    mockMvc.perform(get("/api/2/subscriptionEntries?entryTagEqual=tag6,tag7"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.nextPage").doesNotExist())
      .andExpect(jsonPath("$.content.length()").value(1))
      .andExpect(jsonPath("$.content[0].uuid").value(subscriptionEntry2.getId().toString()));
  }

  @Test
  void shouldFilterByEntryTag8AndTag9() throws Exception {
    mockMvc.perform(get("/api/2/subscriptionEntries?entryTagEqual=tag8"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.nextPage").doesNotExist())
      .andExpect(jsonPath("$.content.length()").value(0));

    mockMvc.perform(get("/api/2/subscriptionEntries?entryTagEqual=tag8Tag9"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.nextPage").doesNotExist())
      .andExpect(jsonPath("$.content.length()").value(1))
      .andExpect(jsonPath("$.content[0].uuid").value(subscriptionEntry2.getId().toString()));
  }

  @Test
  void feedUuidEqualSubscription2() throws Exception {
    mockMvc.perform(get("/api/2/subscriptionEntries?feedUuidEqual={id}", subscription2.getId()))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.nextPage").doesNotExist())
      .andExpect(jsonPath("$.content.length()").value(1))
      .andExpect(jsonPath("$.content[0].uuid").value(subscriptionEntry2.getId().toString()));
  }

  @Test
  void seenEqualsTrue() throws Exception {
    mockMvc.perform(get("/api/2/subscriptionEntries?seenEqual=true"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.nextPage").doesNotExist())
      .andExpect(jsonPath("$.content.length()").value(1))
      .andExpect(jsonPath("$.content[0].uuid").value(subscriptionEntry1.getId().toString()));
  }

  @Test
  void seenEqualsFalse() throws Exception {
    mockMvc.perform(get("/api/2/subscriptionEntries?seenEqual=false"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.nextPage").doesNotExist())
      .andExpect(jsonPath("$.content.length()").value(10))
      .andExpect(jsonPath("$.content[0].uuid").value(subscriptionEntry12.getId().toString()))
      .andExpect(jsonPath("$.content[9].uuid").value(subscriptionEntry2.getId().toString()));
  }

  @Test
  void shouldReturnNextPageForGivenParameters() throws Exception {
    createEntry(subscription1);

    mockMvc.perform(get("/api/2/subscriptionEntries?seenEqual=false"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.nextPage.uuid").value(subscriptionEntry3.getId().toString()))
      .andExpect(jsonPath("$.nextPage.seenEqual").value("false"));
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
      .andExpect(jsonPath("$.nextPage").doesNotExist())
      .andExpect(jsonPath("$.content.length()").value(1))
      .andExpect(jsonPath("$.content[0].uuid").value(subscriptionEntry2.getId().toString()));
  }

  @Test
  void feedTagEqualUnknown() throws Exception {
    mockMvc.perform(get("/api/2/subscriptionEntries?feedTagEqual=unknown"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.nextPage").doesNotExist())
      .andExpect(jsonPath("$.content.length()").value(0));
  }

  @Test
  void shouldPaginateWithChangingSeenValues() throws Exception {
    mockMvc.perform(get("/api/2/subscriptionEntries?seenEqual=false"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.nextPage.uuid").doesNotExist())
      .andExpect(jsonPath("$.nextPage.seenEqual").doesNotExist())
      .andExpect(jsonPath("$.content.length()").value(10))
      .andExpect(jsonPath("$.content[0].uuid").value(subscriptionEntry12.getId().toString()))
      .andExpect(jsonPath("$.content[0].seen").value(false))
      .andExpect(jsonPath("$.content[7].uuid").value(subscriptionEntry4.getId().toString()))
      .andExpect(jsonPath("$.content[7].seen").value(false))
      .andExpect(jsonPath("$.content[8].uuid").value(subscriptionEntry3.getId().toString()))
      .andExpect(jsonPath("$.content[8].seen").value(false));

    jdbcTemplate.update("update subscription_entry set seen = true where id = :id", Map.of("id", subscriptionEntry4.getId()));

    mockMvc.perform(get("/api/2/subscriptionEntries"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.nextPage.uuid").value(subscriptionEntry2.getId()))
      .andExpect(jsonPath("$.content.length()").value(10))
      .andExpect(jsonPath("$.content[0].uuid").value(subscriptionEntry12.getId().toString()))
      .andExpect(jsonPath("$.content[0].seen").value(false))
      .andExpect(jsonPath("$.content[7].uuid").value(subscriptionEntry4.getId().toString()))
      .andExpect(jsonPath("$.content[7].seen").value(true))
      .andExpect(jsonPath("$.content[8].uuid").value(subscriptionEntry3.getId().toString()))
      .andExpect(jsonPath("$.content[8].seen").value(false))
      .andExpect(jsonPath("$.content[9].uuid").value(subscriptionEntry2.getId().toString()))
      .andExpect(jsonPath("$.content[9].seen").value(false));

    mockMvc.perform(get("/api/2/subscriptionEntries?uuid={id}&seenEqual=false", subscriptionEntry4.getId()))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.nextPage").doesNotExist())
      .andExpect(jsonPath("$.content.length()").value(2))
      .andExpect(jsonPath("$.content[0].uuid").value(subscriptionEntry3.getId().toString()))
      .andExpect(jsonPath("$.content[1].uuid").value(subscriptionEntry2.getId().toString()));

    jdbcTemplate.update("update subscription_entry set seen = true where id = :id", Map.of("id", subscriptionEntry2.getId()));

    mockMvc.perform(get("/api/2/subscriptionEntries"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.nextPage.uuid").value(subscriptionEntry2.getId().toString()))
      .andExpect(jsonPath("$.content.length()").value(10))
      .andExpect(jsonPath("$.content[0].uuid").value(subscriptionEntry12.getId().toString()))
      .andExpect(jsonPath("$.content[0].seen").value(false))
      .andExpect(jsonPath("$.content[7].uuid").value(subscriptionEntry4.getId().toString()))
      .andExpect(jsonPath("$.content[7].seen").value(true))
      .andExpect(jsonPath("$.content[8].uuid").value(subscriptionEntry3.getId().toString()))
      .andExpect(jsonPath("$.content[8].seen").value(false))
      .andExpect(jsonPath("$.content[9].uuid").value(subscriptionEntry2.getId().toString()))
      .andExpect(jsonPath("$.content[9].seen").value(true));

    mockMvc.perform(get("/api/2/subscriptionEntries?uuid={id}&seenEqual=false", subscriptionEntry2.getId()))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.nextPage").doesNotExist())
      .andExpect(jsonPath("$.content.length()").value(0));
  }

  private SubscriptionEntry createEntry(Subscription subscription) {
    return createEntry(subscription, false);
  }

  private SubscriptionEntry createEntry(Subscription subscription, boolean excluded) {
    counter += 1;
    return template.save(new SubscriptionEntry(
      String.format("some entry%d title", counter),
      null,
      String.format("http://example.com/feedentry%d", counter),
      String.format("some entry%d content", counter),
      false,
      excluded,
      null,
      subscription.getId(),
      ofEpochMilli(counter * 1000L)
    ));
  }

  private String nextPage(MvcResult mvcResult) throws IOException {
    Map<String, String> nextPage = JsonPath.read(mvcResult.getResponse().getContentAsString(), "nextPage");

    var queryParams = new StringBuilder();
    for (var entry : nextPage.entrySet()) {
      queryParams.append(entry.getKey()).append('=').append(entry.getValue()).append('&');
    }

    return "/api/2/subscriptionEntries?" + queryParams;
  }
}
