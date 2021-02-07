package myreader.resource.feed;

import myreader.entity.Feed;
import myreader.entity.FetchError;
import myreader.repository.FeedRepository;
import myreader.repository.FetchErrorRepository;
import myreader.service.feed.FeedService;
import myreader.test.WithTestProperties;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.Date;
import java.util.Optional;

import static org.hamcrest.Matchers.endsWith;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@SpringBootTest
@WithMockUser
@WithTestProperties
public class FeedResourceTests {

  @Autowired
  private MockMvc mockMvc;

  @MockBean
  private FeedService feedService;

  @MockBean
  private FeedRepository feedRepository;

  @MockBean
  private FetchErrorRepository fetchErrorRepository;

  private Feed feed1;

  @Before
  public void setUp() {
    given(feedService.valid(anyString())).willReturn(true);

    feed1 = new Feed();
    feed1.setId(18L);
    feed1.setUrl("http://feeds.feedburner.com/javaposse");
    feed1.setTitle("Atlassian Blogs");
    feed1.setUrl("http://feeds.feedburner.com/AllAtlassianBlogs");
    feed1.setLastModified("Thu, 27 Mar 2014 13:53:36 GMT");
    feed1.setFetched(142);
    feed1.setCreatedAt(new Date(1000));

    given(feedRepository.findById(feed1.getId())).willReturn(Optional.of(feed1));
    given(fetchErrorRepository.countByFeedId(feed1.getId())).willReturn(1);
  }

  @Test
  public void shouldReturnFetchErrors() throws Exception {
    FetchError fetchError = new FetchError();
    fetchError.setId(1L);
    fetchError.setMessage("error message for feed 18");
    fetchError.setCreatedAt(new Date(2000));

    given(fetchErrorRepository.findByFeedIdOrderByCreatedAtDesc(eq(feed1.getId()), any()))
      .willReturn(new PageImpl<>(Collections.singletonList(fetchError), PageRequest.of(0, 20), 1));

    mockMvc.perform(get("/api/2/feeds/{id}/fetchError", feed1.getId()))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.links[0].rel", is("self")))
      .andExpect(jsonPath("$.links[0].href", endsWith("/api/2/feeds/18/fetchError?page=0&size=20")))
      .andExpect(jsonPath("$.content[0].uuid", is("1")))
      .andExpect(jsonPath("$.content[0].message", is("error message for feed 18")))
      .andExpect(jsonPath("$.content[0].createdAt", is("1970-01-01T00:00:02.000+00:00")))
      .andExpect(jsonPath("$.page.totalElements", is(1)));
  }

  @Test
  public void shouldReturnFeedWithId18() throws Exception {
    mockMvc.perform(get("/api/2/feeds/{id}", feed1.getId()))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.uuid", is("18")))
      .andExpect(jsonPath("$.title", is("Atlassian Blogs")))
      .andExpect(jsonPath("$.url", is("http://feeds.feedburner.com/AllAtlassianBlogs")))
      .andExpect(jsonPath("$.lastModified", is("Thu, 27 Mar 2014 13:53:36 GMT")))
      .andExpect(jsonPath("$.fetched", is(142)))
      .andExpect(jsonPath("$.hasErrors", is(true)))
      .andExpect(jsonPath("$.createdAt", is("1970-01-01T00:00:01.000+00:00")));
  }

  @Test
  public void shouldReturnEmptyFeedResponseForId999() throws Exception {
    mockMvc.perform(get("/api/2/feeds/999"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.uuid", nullValue()))
      .andExpect(jsonPath("$.title", nullValue()))
      .andExpect(jsonPath("$.url", nullValue()))
      .andExpect(jsonPath("$.lastModified", nullValue()))
      .andExpect(jsonPath("$.fetched", nullValue()))
      .andExpect(jsonPath("$.hasErrors", is(false)))
      .andExpect(jsonPath("$.createdAt", nullValue()));
  }
}
