package myreader.resource.exclusionpattern;

import myreader.entity.ExclusionPattern;
import myreader.entity.Subscription;
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
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

import static myreader.test.CustomMockMvcResultMatchers.validation;
import static myreader.test.request.JsonRequestPostProcessors.jsonBody;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
@AutoConfigureTestEntityManager
@Transactional
@SpringBootTest
@WithMockUser
@WithTestProperties
class ExclusionPatternCollectionResourceTests {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private TestEntityManager em;

  @Autowired
  private JdbcAggregateOperations template;

  private Subscription subscription;
  private ExclusionPattern exclusionPattern1;
  private ExclusionPattern exclusionPattern2;

  @BeforeEach
  void setUp() {
    subscription = em.persist(new Subscription("http://localhost", "title"));

    exclusionPattern1 = new ExclusionPattern("pattern1", subscription.getId(), 1, OffsetDateTime.now());
    exclusionPattern1 = template.save(exclusionPattern1);

    exclusionPattern2 = new ExclusionPattern("pattern2", subscription.getId(), 2, OffsetDateTime.now());
    exclusionPattern2 = template.save(exclusionPattern2);
  }

  @Test
  void shouldReturnResponse() throws Exception {
    mockMvc.perform(get("/api/2/exclusions/{id}/pattern", subscription.getId()))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.content[0].uuid").value(exclusionPattern1.getId()))
      .andExpect(jsonPath("$.content[0].hitCount").value(1))
      .andExpect(jsonPath("$.content[0].pattern").value("pattern1"))
      .andExpect(jsonPath("$.content[1].uuid").value(exclusionPattern2.getId()))
      .andExpect(jsonPath("$.content[1].hitCount").value(2))
      .andExpect(jsonPath("$.content[1].pattern").value("pattern2"));
  }

  @Test
  void shouldReturnNotFound() throws Exception {
    mockMvc.perform(get("/api/2/exclusions/999/pattern"))
      .andExpect(status().isNotFound());
  }

  @Test
  void shouldSaveNew() throws Exception {
    var nextExclusionPatternId = exclusionPattern2.getId() + 1;

    mockMvc.perform(post("/api/2/exclusions/{id}/pattern", subscription.getId())
      .with(jsonBody("{'pattern': 'test'}")))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.uuid").value(nextExclusionPatternId))
      .andExpect(jsonPath("$.hitCount").value(0))
      .andExpect(jsonPath("$.pattern").value("test"));

    assertThat(template.findById(nextExclusionPatternId, ExclusionPattern.class))
      .hasFieldOrPropertyWithValue("pattern", "test")
      .hasFieldOrPropertyWithValue("subscriptionId", subscription.getId());
  }

  @Test
  void shouldRejectMissingPatternProperty() throws Exception {
    mockMvc.perform(post("/api/2/exclusions/999/pattern")
      .with(jsonBody("{}")))
      .andExpect(status().isBadRequest())
      .andExpect(validation().onField("pattern").value("invalid regular expression"));
  }

  @Test
  void shouldRejectEmptyPattern() throws Exception {
    mockMvc.perform(post("/api/2/exclusions/999/pattern")
      .with(jsonBody("{'pattern': ''}")))
      .andExpect(status().isBadRequest())
      .andExpect(validation().onField("pattern").value("invalid regular expression"));
  }

  @Test
  void shouldRejectInvalidPattern() throws Exception {
    mockMvc.perform(post("/api/2/exclusions/999/pattern")
      .with(jsonBody("{'pattern': '\\\\k'}")))
      .andExpect(status().isBadRequest())
      .andExpect(validation().onField("pattern").value("invalid regular expression"));
  }
}
