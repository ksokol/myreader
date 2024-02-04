package myreader.views.navigation;

import myreader.entity.FetchError;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.test.WithTestProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.jdbc.core.JdbcAggregateOperations;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static myreader.test.OffsetDateTimes.ofEpochMilli;
import static myreader.test.request.AuthorizationPostProcessors.authorization;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
@Transactional
@SpringBootTest
@WithTestProperties
class NavigationViewTests {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private JdbcAggregateOperations template;

  private Subscription subscription1;
  private Subscription subscription2;

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

    template.save(new FetchError(subscription1.getId(), "message 1", ofEpochMilli(1000)));
    template.save(new FetchError(subscription1.getId(), "message 2", ofEpochMilli(2000)));

    template.save(new SubscriptionEntry(
      null,
      null,
      "url",
      null,
      false,
      false,
      subscription1.getId(),
      ofEpochMilli(1000)
    ));

    subscription2 = template.save(new Subscription(
      "http://feed2",
      "user102_subscription2",
      "tag2",
      "#111111",
      20,
      null,
      0,
      null,
      true,
      ofEpochMilli(4000)
    ));

    template.save(new SubscriptionEntry(
      null,
      null,
      "url",
      null,
      false,
      false,
      subscription2.getId(),
      ofEpochMilli(1000)
    ));

    template.save(new SubscriptionEntry(
      null,
      null,
      "url",
      null,
      false,
      false,
      subscription2.getId(),
      ofEpochMilli(1000)
    ));
  }

  @Test
  void shouldReturnExpectedJsonStructure() throws Exception {
    mockMvc.perform(get("/views/NavigationView")
        .with(authorization()))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.subscriptions.length()").value(2))
      .andExpect(jsonPath("$.subscriptions[0].uuid").value(subscription2.getId().toString()))
      .andExpect(jsonPath("$.subscriptions[0].title").value("user102_subscription2"))
      .andExpect(jsonPath("$.subscriptions[0].sum").value(20))
      .andExpect(jsonPath("$.subscriptions[0].unseen").value(2))
      .andExpect(jsonPath("$.subscriptions[0].origin").value("http://feed2"))
      .andExpect(jsonPath("$.subscriptions[0].fetchErrorCount").value(0))
      .andExpect(jsonPath("$.subscriptions[0].tag").value("tag2"))
      .andExpect(jsonPath("$.subscriptions[0].color").value("#111111"))
      .andExpect(jsonPath("$.subscriptions[0].createdAt").value("1970-01-01T00:00:04Z"))
      .andExpect(jsonPath("$.subscriptions[1].uuid").value(subscription1.getId().toString()))
      .andExpect(jsonPath("$.subscriptions[1].title").value("user102_subscription1"))
      .andExpect(jsonPath("$.subscriptions[1].sum").value(10))
      .andExpect(jsonPath("$.subscriptions[1].unseen").value(1))
      .andExpect(jsonPath("$.subscriptions[1].origin").value("http://feed1"))
      .andExpect(jsonPath("$.subscriptions[1].fetchErrorCount").value(2))
      .andExpect(jsonPath("$.subscriptions[1].tag").value("tag1"))
      .andExpect(jsonPath("$.subscriptions[1].color").isEmpty())
      .andExpect(jsonPath("$.subscriptions[1].createdAt").value("1970-01-01T00:00:02Z"));
  }

  @Test
  void shouldFindAnySubscriptionsWithUnseenGreaterThanMinusOne() throws Exception {
    mockMvc.perform(get("/views/NavigationView?unseenGreaterThan=-1")
        .with(authorization()))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.subscriptions.length()").value(2))
      .andExpect(jsonPath("$.subscriptions[0].uuid").value(subscription2.getId().toString()))
      .andExpect(jsonPath("$.subscriptions[1].uuid").value(subscription1.getId().toString()));
  }

  private List<String> list(String... values) {
    List<String> valueList = new ArrayList<>();
    Collections.addAll(valueList, values);
    return valueList;
  }
}
