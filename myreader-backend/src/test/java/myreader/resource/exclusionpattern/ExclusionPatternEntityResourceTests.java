package myreader.resource.exclusionpattern;

import myreader.entity.ExclusionPattern;
import myreader.entity.Feed;
import myreader.entity.Subscription;
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

import static myreader.test.TestUser.USER4;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
@AutoConfigureTestEntityManager
@Transactional
@ClearDb
@SpringBootTest
@WithTestProperties
@WithAuthenticatedUser(TestUser.USER4)
class ExclusionPatternEntityResourceTests {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private TestEntityManager em;

  private Subscription subscription;
  private ExclusionPattern exclusionPattern;

  @BeforeEach
  void beforeEach() {
    var user = em.persist(USER4.toUser());
    var feed = em.persist(new Feed("http://example.com", "feed title"));

    subscription = em.persist(new Subscription(user, feed));
    exclusionPattern = em.persist(new ExclusionPattern("test", subscription));
  }

  @Test
  void shouldDelete() throws Exception {
     mockMvc.perform(delete("/api/2/exclusions/{subscriptionId}/pattern/{patternId}", subscription.getId(), exclusionPattern.getId()))
      .andExpect(status().isOk());

    assertThat(em.getEntityManager().createQuery("from ExclusionPattern").getResultList()).isEmpty();
  }

  @Test
  void shouldReturnNotFound() throws Exception {
    mockMvc.perform(delete("/api/2/exclusions/{subscriptionId}/pattern/{patternId}", subscription.getId(), 999L))
      .andExpect(status().isNotFound());

    assertThat(em.getEntityManager().createQuery("from ExclusionPattern").getResultList()).isNotEmpty();
  }
}
