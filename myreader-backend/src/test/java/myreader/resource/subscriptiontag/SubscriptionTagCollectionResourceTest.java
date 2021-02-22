package myreader.resource.subscriptiontag;

import myreader.entity.Subscription;
import myreader.test.WithTestProperties;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.jdbc.core.JdbcAggregateOperations;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static myreader.test.OffsetDateTimes.ofEpochMilli;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
@Transactional
@SpringBootTest
@WithMockUser
@WithTestProperties
class SubscriptionTagCollectionResourceTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private JdbcAggregateOperations template;

  @Test
  void shouldFetchDistinctTags() throws Exception {
    subscriptionWithTag("tag1");
    subscriptionWithTag("tag2");
    subscriptionWithTag("tag2");

    mockMvc.perform(get("/api/2/subscriptionTags"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.length()").value(2))
      .andExpect(jsonPath("$.[0]").value("tag1"))
      .andExpect(jsonPath("$.[1]").value("tag2"));
  }

  private void subscriptionWithTag(String tag) {
    var subscription = new Subscription(
      "url",
      "title",
      null,
      null,
      0,
      null,
      0,
      null,
      ofEpochMilli(1000)
    );
    subscription.setTag(tag);
    template.save(subscription);
  }
}
