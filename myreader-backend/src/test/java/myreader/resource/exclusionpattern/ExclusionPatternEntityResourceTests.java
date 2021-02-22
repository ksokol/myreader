package myreader.resource.exclusionpattern;

import myreader.entity.ExclusionPattern;
import myreader.entity.Subscription;
import myreader.test.WithTestProperties;
import org.junit.jupiter.api.BeforeEach;
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

import java.time.OffsetDateTime;

import static myreader.test.OffsetDateTimes.ofEpochMilli;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
@Transactional
@SpringBootTest
@WithMockUser
@WithTestProperties
class ExclusionPatternEntityResourceTests {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private JdbcAggregateOperations template;

  private Subscription subscription;
  private ExclusionPattern exclusionPattern;

  @BeforeEach
  void beforeEach() {
    subscription = template.save(new Subscription(
      "http://example.com",
      "feed title",
      null,
      null,
      0,
      null,
      0,
      null,
      ofEpochMilli(1000))
    );
    exclusionPattern = template.save(new ExclusionPattern("test", subscription.getId(), 0, OffsetDateTime.now()));
  }

  @Test
  void shouldDelete() throws Exception {
     mockMvc.perform(delete("/api/2/exclusions/{subscriptionId}/pattern/{patternId}", subscription.getId(), exclusionPattern.getId()))
      .andExpect(status().isOk());

    assertThat(template.findAll(ExclusionPattern.class))
      .isEmpty();
  }

  @Test
  void shouldReturnNotFound() throws Exception {
    mockMvc.perform(delete("/api/2/exclusions/{subscriptionId}/pattern/{patternId}", subscription.getId(), 999L))
      .andExpect(status().isNotFound());

    assertThat(template.findAll(ExclusionPattern.class))
      .isNotEmpty();
  }
}
