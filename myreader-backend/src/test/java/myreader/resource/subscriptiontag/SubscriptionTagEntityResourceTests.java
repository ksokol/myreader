package myreader.resource.subscriptiontag;

import myreader.entity.Feed;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionTag;
import myreader.repository.SubscriptionRepository;
import myreader.repository.SubscriptionTagRepository;
import myreader.test.WithTestProperties;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Date;
import java.util.Optional;

import static myreader.test.CustomMockMvcResultMatchers.validation;
import static myreader.test.request.JsonRequestPostProcessors.jsonBody;
import static org.hamcrest.Matchers.is;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@SpringBootTest
@WithMockUser
@WithTestProperties
public class SubscriptionTagEntityResourceTests {

  @Autowired
  private MockMvc mockMvc;

  @MockBean
  private SubscriptionTagRepository subscriptionTagRepository;

  @MockBean
  private SubscriptionRepository subscriptionRepository;

  @Test
  public void shouldReturn404WhenSubscriptionTagIsNotFound() throws Exception {
    given(subscriptionTagRepository.findById(1L)).willReturn(Optional.empty());

    mockMvc.perform(patch("/api/2/subscriptionTags/1")
      .with(jsonBody("{'name': 'expected name', 'color': '#111'}")))
      .andExpect(status().isNotFound());
  }

  @Test
  public void shouldPatchWhenSubscriptionTagIsFound() throws Exception {
    Subscription subscription = new Subscription(new Feed());
    subscription.setId(2L);

    SubscriptionTag subscriptionTag = new SubscriptionTag("name", subscription);
    subscriptionTag.setId(1L);
    subscriptionTag.setCreatedAt(new Date(1000));

    given(subscriptionTagRepository.findById(1L)).willReturn(Optional.of(subscriptionTag));
    given(subscriptionTagRepository.save(subscriptionTag)).willReturn(subscriptionTag);

    mockMvc.perform(patch("/api/2/subscriptionTags/1")
      .with(jsonBody("{'name': 'expected name', 'color': '#111'}")))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.uuid", is("1")))
      .andExpect(jsonPath("$.name", is("expected name")))
      .andExpect(jsonPath("$.color", is("#111")))
      .andExpect(jsonPath("$.createdAt", is("1970-01-01T00:00:01.000+00:00")));
  }

  @Test
  public void shouldReturnSubscriptionTagFromSubscriptionResource() throws Exception {
    Subscription subscription = new Subscription(new Feed());
    subscription.setId(2L);

    SubscriptionTag subscriptionTag = new SubscriptionTag("expected name", subscription);
    subscriptionTag.setId(1L);
    subscriptionTag.setColor("#111");
    subscriptionTag.setCreatedAt(new Date(1000));
    subscription.setSubscriptionTag(subscriptionTag);

    given(subscriptionRepository.findById(2L)).willReturn(Optional.of(subscription));

    mockMvc.perform(get("/api/2/subscriptions/2"))
      .andExpect(jsonPath("$.feedTag.uuid", is("1")))
      .andExpect(jsonPath("$.feedTag.name", is("expected name")))
      .andExpect(jsonPath("$.feedTag.color", is("#111")))
      .andExpect(jsonPath("$.feedTag.createdAt", is("1970-01-01T00:00:01.000+00:00")));
  }

  @Test
  public void shouldRejectPatchRequestWhenNameIsMissing() throws Exception {
    mockMvc.perform(patch("/api/2/subscriptionTags/1")
      .with(jsonBody("{}")))
      .andExpect(status().isBadRequest())
      .andExpect(validation().onField("name", is("may not be empty")));
  }

  @Test
  public void shouldRejectPatchRequestWhenColorIsSomeString() throws Exception {
    mockMvc.perform(patch("/api/2/subscriptionTags/1")
      .with(jsonBody("{'name': 'name', 'color': 'yellow'}")))
      .andExpect(status().isBadRequest())
      .andExpect(validation().onField("color", is("not a RGB hex code")));
  }

  @Test
  public void shouldRejectPatchRequestWhenColorIsAnInvalidRgbHexCode() throws Exception {
    mockMvc.perform(patch("/api/2/subscriptionTags/1")
      .with(jsonBody("{'name': 'name', 'color': '#0000000'}")))
      .andExpect(status().isBadRequest())
      .andExpect(validation().onField("color", is("not a RGB hex code")));
  }
}
