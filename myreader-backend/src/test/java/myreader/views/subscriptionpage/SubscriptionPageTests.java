package myreader.views.subscriptionpage;

import myreader.entity.ExclusionPattern;
import myreader.entity.FetchError;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.service.subscription.SubscriptionService;
import myreader.test.WithTestProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.data.jdbc.core.JdbcAggregateOperations;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

import static myreader.test.OffsetDateTimes.ofEpochMilli;
import static myreader.test.request.JsonRequestPostProcessors.jsonBody;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
@Transactional
@SpringBootTest
@WithMockUser
@WithTestProperties
class SubscriptionPageTests {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private JdbcAggregateOperations template;

  @SpyBean
  private SubscriptionService subscriptionService;

  private Subscription subscription;
  private ExclusionPattern exclusionPattern1;
  private ExclusionPattern exclusionPattern2;
  private FetchError fetchError1;
  private FetchError fetchError2;

  @BeforeEach
  void setUp() {
    subscription = template.save(new Subscription(
      "http://example.com",
      "expected title",
      "subscriptiontag name",
      "#111111",
      15,
      null,
      0,
      null,
      ofEpochMilli(2000)
    ));

    exclusionPattern1 = template.save(new ExclusionPattern("pattern1", subscription.getId(), 10, ofEpochMilli(1000)));
    exclusionPattern2 = template.save(new ExclusionPattern("pattern2", subscription.getId(), 20, ofEpochMilli(1000)));

    fetchError1 = template.save(new FetchError(subscription.getId(), "message 1", ofEpochMilli(1000)));
    fetchError2 = template.save(new FetchError(subscription.getId(), "message 2", ofEpochMilli(2000)));

    template.save(new SubscriptionEntry(
      null,
      null,
      "url",
      null,
      false,
      false,
      Set.of("tag1", "tag2"),
      subscription.getId(),
      ofEpochMilli(1000)
    ));

    given(subscriptionService.valid("http://example.com"))
      .willReturn(true);
  }

  @Test
  void shouldReturnResponse() throws Exception {
    mockMvc.perform(get("/views/SubscriptionPage/{id}", subscription.getId()))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.subscription.uuid").value(subscription.getId().toString()))
      .andExpect(jsonPath("$.subscription.title").value("expected title"))
      .andExpect(jsonPath("$.subscription.origin").value("http://example.com"))
      .andExpect(jsonPath("$.subscription.tag").value("subscriptiontag name"))
      .andExpect(jsonPath("$.subscription.color").value("#111111"))
      .andExpect(jsonPath("exclusionPatterns[0].uuid").value(exclusionPattern1.getId()))
      .andExpect(jsonPath("exclusionPatterns[0].hitCount").value(10))
      .andExpect(jsonPath("exclusionPatterns[0].pattern").value("pattern1"))
      .andExpect(jsonPath("exclusionPatterns[1].uuid").value(exclusionPattern2.getId()))
      .andExpect(jsonPath("exclusionPatterns[1].hitCount").value(20))
      .andExpect(jsonPath("exclusionPatterns[1].pattern").value("pattern2"))
      .andExpect(jsonPath("fetchErrors.length()").value(2))
      .andExpect(jsonPath("fetchErrors.[0].uuid").value(fetchError2.getId()))
      .andExpect(jsonPath("fetchErrors.[0].message").value("message 2"))
      .andExpect(jsonPath("fetchErrors.[0].createdAt").value("1970-01-01T00:00:02Z"))
      .andExpect(jsonPath("fetchErrors.[1].uuid").value(fetchError1.getId()))
      .andExpect(jsonPath("fetchErrors.[1].message").value("message 1"))
      .andExpect(jsonPath("fetchErrors.[1].createdAt").value("1970-01-01T00:00:01Z"));
  }

  @Test
  void shouldDeleteSubscription() throws Exception {
    mockMvc.perform(delete("/views/SubscriptionPage/{id}/subscription", subscription.getId()))
      .andExpect(status().isNoContent());

    assertThat(template.findById(subscription.getId(), Subscription.class))
      .isNull();
  }

  @Test
  void shouldReturnNotFoundWhenTryingToDeleteUnknownSubscription() throws Exception {
    mockMvc.perform(delete("/views/SubscriptionPage/9999/subscription"))
      .andExpect(status().isNotFound());
  }

  @Test
  void shouldReturnNotFoundWhenTryingToUpdateUnknownSubscription() throws Exception {
    mockMvc.perform(patch("/views/SubscriptionPage/9999/subscription")
      .with(jsonBody("{'title': 'irrelevant', 'origin': 'http://example.com', 'tag' : 'irrelevant'}")))
      .andExpect(status().isNotFound());
  }

  @Test
  void shouldPatchSubscriptionTitleAndOriginAndColor() throws Exception {
    given(subscriptionService.valid("http://other.com"))
      .willReturn(true);

    mockMvc.perform(patch("/views/SubscriptionPage/{id}/subscription", subscription.getId())
      .with(jsonBody("{'title': 'changed title', 'origin': 'http://other.com', 'tag': 'subscriptiontag name', 'color': '#222222'}")))
      .andExpect(status().isOk())
      .andExpect(jsonPath("subscription.title").value("changed title"))
      .andExpect(jsonPath("subscription.origin").value("http://other.com"))
      .andExpect(jsonPath("subscription.tag").value("subscriptiontag name"))
      .andExpect(jsonPath("subscription.color").value("#222222"));
  }

  @Test
  void shouldRejectPatchRequestWhenTitleAndOriginPropertiesAreAbsent() throws Exception {
    mockMvc.perform(patch("/views/SubscriptionPage/{id}/subscription", subscription.getId())
      .with(jsonBody("{'feedTag': {}}")))
      .andExpect(status().isBadRequest())
      .andExpect(jsonPath("errors.[0].field").value("title"))
      .andExpect(jsonPath("errors.[0].defaultMessage").value("may not be empty"))
      .andExpect(jsonPath("errors.[1].field").value("origin"))
      .andExpect(jsonPath("errors.[1].defaultMessage").value("invalid syndication feed"));
  }

  @Test
  void shouldValidateSubscriptionTitle() throws Exception {
    mockMvc.perform(patch("/views/SubscriptionPage/{id}/subscription", subscription.getId())
      .with(jsonBody("{'title': ' ', 'origin': 'http://example.com'}")))
      .andExpect(status().isBadRequest())
      .andExpect(jsonPath("errors.[0].field").value("title"))
      .andExpect(jsonPath("errors.[0].defaultMessage").value("may not be empty"));
  }

  @Test
  void shouldValidatePatchRequestAbsentOriginProperty() throws Exception {
    mockMvc.perform(patch("/views/SubscriptionPage/{id}/subscription", subscription.getId())
      .with(jsonBody("{'title': 'some title'}")))
      .andExpect(status().isBadRequest())
      .andExpect(jsonPath("errors.[0].field").value("origin"))
      .andExpect(jsonPath("errors.[0].defaultMessage").value("invalid syndication feed"));
  }

  @Test
  void shouldValidatePatchRequestInvalidOrigin() throws Exception {
    given(subscriptionService.valid("http://example.local"))
      .willReturn(false);

    mockMvc.perform(patch("/views/SubscriptionPage/{id}/subscription", subscription.getId())
      .with(jsonBody("{'title': 'some title', 'origin': 'http://example.local'}")))
      .andExpect(status().isBadRequest())
      .andExpect(jsonPath("errors.[0].field").value("origin"))
      .andExpect(jsonPath("errors.[0].defaultMessage").value("invalid syndication feed"));
  }

  @Test
  void shouldValidatePatchRequestInvalidColor() throws Exception {
    mockMvc.perform(patch("/views/SubscriptionPage/{id}/subscription", subscription.getId())
      .with(jsonBody("{'title': 'some title', 'origin': 'http://example.com', 'color': 'invalid'}")))
      .andExpect(status().isBadRequest())
      .andExpect(jsonPath("errors.[0].field").value("color"))
      .andExpect(jsonPath("errors.[0].defaultMessage").value("not a RGB hex code"));
  }

  @Test
  void shouldDeleteExclusionPattern() throws Exception {
    mockMvc.perform(delete("/views/SubscriptionPage/{subscriptionId}/exclusionPatterns/{patternId}", subscription.getId(), exclusionPattern1.getId()))
      .andExpect(status().isOk());

    assertThat(template.findById(exclusionPattern1.getId(), ExclusionPattern.class))
      .isNull();
  }

  @Test
  void shouldReturnNotFoundIfTryingToDeleteUnknownExclusionPattern() throws Exception {
    mockMvc.perform(delete("/views/SubscriptionPage/{subscriptionId}/exclusionPatterns/{patternId}", subscription.getId(), 999L))
      .andExpect(status().isNotFound());

    assertThat(template.findAll(ExclusionPattern.class))
      .isNotEmpty();
  }

  @Test
  void shouldSaveNewExclusionPattern() throws Exception {
    var nextExclusionPatternId = exclusionPattern2.getId() + 1;

    mockMvc.perform(post("/views/SubscriptionPage/{id}/exclusionPatterns", subscription.getId())
      .with(jsonBody("{'pattern': 'test'}")))
      .andExpect(status().isOk())
      .andExpect(jsonPath("exclusionPatterns[0].uuid").value(exclusionPattern1.getId()))
      .andExpect(jsonPath("exclusionPatterns[0].hitCount").value(10))
      .andExpect(jsonPath("exclusionPatterns[0].pattern").value("pattern1"))
      .andExpect(jsonPath("exclusionPatterns[1].uuid").value(exclusionPattern2.getId()))
      .andExpect(jsonPath("exclusionPatterns[1].hitCount").value(20))
      .andExpect(jsonPath("exclusionPatterns[1].pattern").value("pattern2"))
      .andExpect(jsonPath("exclusionPatterns[2].uuid").value(nextExclusionPatternId))
      .andExpect(jsonPath("exclusionPatterns[2].hitCount").value(0))
      .andExpect(jsonPath("exclusionPatterns[2].pattern").value("test"));

    assertThat(template.findById(nextExclusionPatternId, ExclusionPattern.class))
      .hasFieldOrPropertyWithValue("pattern", "test")
      .hasFieldOrPropertyWithValue("subscriptionId", subscription.getId());
  }

  @Test
  void shouldRejectMissingPatternProperty() throws Exception {
    mockMvc.perform(post("/views/SubscriptionPage/{subscriptionId}/exclusionPatterns", subscription.getId())
      .with(jsonBody("{}")))
      .andExpect(status().isBadRequest())
      .andExpect(jsonPath("errors.[0].field").value("pattern"))
      .andExpect(jsonPath("errors.[0].defaultMessage").value("invalid regular expression"));
  }

  @Test
  void shouldRejectEmptyPattern() throws Exception {
    mockMvc.perform(post("/views/SubscriptionPage/{subscriptionId}/exclusionPatterns", subscription.getId())
      .with(jsonBody("{'pattern': ''}")))
      .andExpect(status().isBadRequest())
      .andExpect(jsonPath("errors.[0].field").value("pattern"))
      .andExpect(jsonPath("errors.[0].defaultMessage").value("invalid regular expression"));
  }

  @Test
  void shouldRejectInvalidPattern() throws Exception {
    mockMvc.perform(post("/views/SubscriptionPage/{subscriptionId}/exclusionPatterns/", subscription.getId())
      .with(jsonBody("{'pattern': '\\\\k'}")))
      .andExpect(status().isBadRequest())
      .andExpect(jsonPath("errors.[0].field").value("pattern"))
      .andExpect(jsonPath("errors.[0].defaultMessage").value("invalid regular expression"));
  }
}
