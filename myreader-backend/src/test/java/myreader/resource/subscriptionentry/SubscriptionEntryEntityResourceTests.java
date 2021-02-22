package myreader.resource.subscriptionentry;

import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.test.WithTestProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureTestEntityManager;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.jdbc.core.JdbcAggregateOperations;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import javax.transaction.Transactional;
import java.util.Set;

import static myreader.test.OffsetDateTimes.ofEpochMilli;
import static myreader.test.request.JsonRequestPostProcessors.jsonBody;
import static org.assertj.core.api.Assertions.assertThat;
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
class SubscriptionEntryEntityResourceTests {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private TestEntityManager em;

  @Autowired
  private JdbcAggregateOperations template;

  private Subscription subscription;
  private SubscriptionEntry subscriptionEntry;

  @BeforeEach
  void before() {
    subscription = new Subscription("http://example.com", "feed title");
    subscription.setTitle("user112_subscription1");
    subscription.setTag("tag1");
    subscription.setColor("#777");
    subscription = em.persist(subscription);

    subscriptionEntry = template.save(new SubscriptionEntry(
      "Bliki: TellDontAsk",
      "guid",
      "http://martinfowler.com/bliki/TellDontAsk.html",
      "content",
      true,
      false,
      Set.of("tag3"),
      subscription.getId(),
      ofEpochMilli(1000)
    ));
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
      .andExpect(jsonPath("$.createdAt").value("1970-01-01T00:00:01Z"));

    assertThat(template.findById(subscriptionEntry.getId(), SubscriptionEntry.class))
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
      .andExpect(jsonPath("$.createdAt").value("1970-01-01T00:00:01Z"));

    assertThat(template.findById(subscriptionEntry.getId(), SubscriptionEntry.class))
      .hasFieldOrPropertyWithValue("seen", false)
      .hasFieldOrPropertyWithValue("tags", Set.of("tag-patched"));
  }
}
