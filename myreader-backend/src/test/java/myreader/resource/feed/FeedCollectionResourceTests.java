package myreader.resource.feed;

import myreader.entity.Feed;
import myreader.entity.FetchError;
import myreader.entity.Subscription;
import myreader.test.ClearDb;
import myreader.test.WithTestProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureTestEntityManager;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.Set;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
@AutoConfigureTestEntityManager
@Transactional
@ClearDb
@SpringBootTest
@WithMockUser
@WithTestProperties
class FeedCollectionResourceTests {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private TestEntityManager em;

  private Feed feed1;
  private Feed feed2;

  @BeforeEach
  void before() {
    feed1 = new Feed("http://localhost", "expected title1");
    feed1.setTitle("expected title1");
    feed1.setUrl("http://url1");
    feed1.setLastModified("Thu, 27 Mar 2013 13:53:36 GMT");
    feed1.setFetched(10);
    feed1.setCreatedAt(new Date(1000));
    feed1.setFetchErrors(Set.of(new FetchError()));
    feed1 = em.persist(feed1);
    em.persist(new Subscription(feed1));

    var fetchError1 = new FetchError();
    fetchError1.setFeed(feed1);
    em.persist(fetchError1);

    feed2 = new Feed("http://localhost", "expected title2");
    feed2.setTitle("expected title2");
    feed2.setUrl("http://url2");
    feed2.setLastModified("Thu, 27 Mar 2014 13:53:36 GMT");
    feed2.setFetched(20);
    feed2.setCreatedAt(new Date(2000));
    feed2 = em.persist(feed2);
    em.persist(new Subscription(feed2));
  }

  @Test
  void shouldReturnFeedsSortedByCreatedAtDescending() throws Exception {
    mockMvc.perform(get("/api/2/feeds"))
      .andExpect(jsonPath("$.links[0].rel").value("self"))
      .andExpect(jsonPath("$.links[0].href").value("http://localhost/api/2/feeds?page=0&size=2"))
      .andExpect(jsonPath("$.content[0].uuid").value(feed2.getId().toString()))
      .andExpect(jsonPath("$.content[0].title").value("expected title2"))
      .andExpect(jsonPath("$.content[0].url").value("http://url2"))
      .andExpect(jsonPath("$.content[0].lastModified").value("Thu, 27 Mar 2014 13:53:36 GMT"))
      .andExpect(jsonPath("$.content[0].fetched").value(20))
      .andExpect(jsonPath("$.content[0].hasErrors").value(false))
      .andExpect(jsonPath("$.content[0].createdAt").value("1970-01-01T00:00:02.000+00:00"))
      .andExpect(jsonPath("$.content[1].uuid").value(feed1.getId().toString()))
      .andExpect(jsonPath("$.content[1].title").value("expected title1"))
      .andExpect(jsonPath("$.content[1].url").value("http://url1"))
      .andExpect(jsonPath("$.content[1].lastModified").value("Thu, 27 Mar 2013 13:53:36 GMT"))
      .andExpect(jsonPath("$.content[1].fetched").value(10))
      .andExpect(jsonPath("$.content[1].hasErrors").value(true))
      .andExpect(jsonPath("$.content[1].createdAt").value("1970-01-01T00:00:01.000+00:00"))
      .andExpect(jsonPath("$.page.totalElements").value(2));
  }
}
