package myreader.resource.exclusionpattern;

import myreader.entity.ExclusionPattern;
import myreader.entity.Feed;
import myreader.entity.Subscription;
import myreader.repository.ExclusionRepository;
import myreader.repository.SubscriptionRepository;
import myreader.test.WithTestProperties;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.stubbing.Answer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Optional;

import static myreader.test.CustomMockMvcResultMatchers.validation;
import static myreader.test.request.JsonRequestPostProcessors.jsonBody;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.hamcrest.MockitoHamcrest.argThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@SpringBootTest
@WithMockUser
@WithTestProperties
public class ExclusionPatternCollectionResourceTests {

  @Autowired
  private MockMvc mockMvc;

  @MockBean
  private ExclusionRepository exclusionRepository;

  @MockBean
  private SubscriptionRepository subscriptionRepository;

  private Subscription subscription;
  private ExclusionPattern exclusionPattern1;

  @Before
  public void setUp() {
    subscription = new Subscription(new Feed("http://localhost", "title"));
    subscription.setId(1L);
    given(subscriptionRepository.findById(109L))
      .willReturn(Optional.of(subscription));

    exclusionPattern1 = new ExclusionPattern();
    exclusionPattern1.setId(5L);
    exclusionPattern1.setHitCount(1);
    exclusionPattern1.setPattern("pattern1");

    ExclusionPattern exclusionPattern2 = new ExclusionPattern();
    exclusionPattern2.setId(6L);
    exclusionPattern2.setHitCount(2);
    exclusionPattern2.setPattern("pattern2");

    given(exclusionRepository.findBySubscriptionId(subscription.getId()))
      .willReturn(Arrays.asList(exclusionPattern1, exclusionPattern2));
  }

  @Test
  public void shouldReturnResponse() throws Exception {
    mockMvc.perform(get("/api/2/exclusions/109/pattern"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.content[0].uuid", is("5")))
      .andExpect(jsonPath("$.content[0].hitCount", is(1)))
      .andExpect(jsonPath("$.content[0].pattern", is("pattern1")))
      .andExpect(jsonPath("$.content[1].uuid", is("6")))
      .andExpect(jsonPath("$.content[1].hitCount", is(2)))
      .andExpect(jsonPath("$.content[1].pattern", is("pattern2")));
  }

  @Test
  public void shouldReturnNotFound() throws Exception {
    given(subscriptionRepository.findById(1L))
      .willReturn(Optional.empty());

    mockMvc.perform(get("/api/2/exclusions/1/pattern"))
      .andExpect(status().isNotFound());
  }

  @Test
  public void shouldSaveNew() throws Exception {
    given(exclusionRepository.save(any())).willAnswer((Answer<ExclusionPattern>) invocation -> {
      ExclusionPattern pattern = (ExclusionPattern) invocation.getArguments()[0];
      pattern.setId(999L);
      return pattern;
    });

    mockMvc.perform(post("/api/2/exclusions/109/pattern")
      .with(jsonBody("{'pattern': 'test'}")))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.uuid", is("999")))
      .andExpect(jsonPath("$.hitCount", is(0)))
      .andExpect(jsonPath("$.pattern", is("test")));

    verify(exclusionRepository).save(argThat(allOf(
      hasProperty("pattern", is("test")),
      hasProperty("subscription", is(subscription))
    )));
  }

  @Test
  public void shouldRejectMissingPatternProperty() throws Exception {
    mockMvc.perform(post("/api/2/exclusions/9/pattern")
      .with(jsonBody("{}")))
      .andExpect(status().isBadRequest())
      .andExpect(validation().onField("pattern", is("invalid regular expression")));
  }

  @Test
  public void shouldRejectEmptyPattern() throws Exception {
    mockMvc.perform(post("/api/2/exclusions/9/pattern")
      .with(jsonBody("{'pattern': ''}")))
      .andExpect(status().isBadRequest())
      .andExpect(validation().onField("pattern", is("invalid regular expression")));
  }

  @Test
  public void shouldRejectInvalidPattern() throws Exception {
    mockMvc.perform(post("/api/2/exclusions/9/pattern")
      .with(jsonBody("{'pattern': '\\\\k'}")))
      .andExpect(status().isBadRequest())
      .andExpect(validation().onField("pattern", is("invalid regular expression")));
  }

  @Test
  public void shouldNotUpdate() throws Exception {
    given(exclusionRepository.findBySubscriptionIdAndPattern(subscription.getId(), "pattern1"))
      .willReturn(exclusionPattern1);

    mockMvc.perform(post("/api/2/exclusions/109/pattern")
      .with(jsonBody("{'pattern': 'pattern1'}")))
      .andExpect(status().isOk());

    mockMvc.perform(post("/api/2/exclusions/109/pattern")
      .with(jsonBody("{'pattern': 'pattern1'}")))
      .andExpect(status().isOk());

    verify(exclusionRepository, never()).save(any());
  }
}
