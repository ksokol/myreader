package myreader.resource.subscriptionentry;

import myreader.entity.FeedEntry;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.entity.SubscriptionTag;
import myreader.repository.SubscriptionEntryRepository;
import myreader.test.TestUser;
import myreader.test.WithAuthenticatedUser;
import myreader.test.WithTestProperties;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.hamcrest.MockitoHamcrest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Date;
import java.util.Optional;

import static myreader.test.request.JsonRequestPostProcessors.jsonBody;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.is;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@SpringBootTest
@WithAuthenticatedUser(TestUser.USER4)
@WithTestProperties
public class SubscriptionEntryEntityResourceTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SubscriptionEntryRepository subscriptionEntryRepository;

    @Before
    public void before() {
        SubscriptionEntry se = new SubscriptionEntry();
        se.setId(1014L);
        se.setTag("tag3");
        se.setSeen(true);
        se.setCreatedAt(new Date(1000));

        FeedEntry fe = new FeedEntry();
        fe.setTitle("Bliki: TellDontAsk");
        fe.setContent("content");
        fe.setUrl("http://martinfowler.com/bliki/TellDontAsk.html");
        se.setFeedEntry(fe);

        Subscription subscription1 = new Subscription();
        se.setSubscription(subscription1);
        subscription1.setId(1100L);
        subscription1.setTitle("user112_subscription1");

        SubscriptionTag st1 = new SubscriptionTag();
        subscription1.setSubscriptionTag(st1);
        st1.setColor("#777");
        st1.setName("tag1");

        given(subscriptionEntryRepository.findByIdAndUserId(1014L, TestUser.USER4.id))
                .willReturn(Optional.of(se));
    }

    @Test
    public void shouldReturnExpectedJsonStructure() throws Exception {
        mockMvc.perform(get("/api/2/subscriptionEntries/1014"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.uuid", is("1014")))
                .andExpect(jsonPath("$.title", is("Bliki: TellDontAsk")))
                .andExpect(jsonPath("$.feedTitle", is("user112_subscription1")))
                .andExpect(jsonPath("$.tag", is("tag3")))
                .andExpect(jsonPath("$.content", is("content")))
                .andExpect(jsonPath("$.seen", is(true)))
                .andExpect(jsonPath("$.feedTag", is("tag1")))
                .andExpect(jsonPath("$.feedTagColor", is("#777")))
                .andExpect(jsonPath("$.feedUuid", is("1100")))
                .andExpect(jsonPath("$.origin", is("http://martinfowler.com/bliki/TellDontAsk.html")))
                .andExpect(jsonPath("$.createdAt", is("1970-01-01T00:00:01.000+00:00")));
    }

    @Test
    public void shouldReturnNotFound() throws Exception {
        mockMvc.perform(get("/api/2/subscriptionEntries/1001"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void shouldOnlyChangeTag() throws Exception {
        mockMvc.perform(patch("/api/2/subscriptionEntries/1014")
                .with(jsonBody("{'tag': 'tag-patched'}")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.uuid", is("1014")))
                .andExpect(jsonPath("$.title", is("Bliki: TellDontAsk")))
                .andExpect(jsonPath("$.feedTitle", is("user112_subscription1")))
                .andExpect(jsonPath("$.tag", is("tag-patched")))
                .andExpect(jsonPath("$.content", is("content")))
                .andExpect(jsonPath("$.seen", is(true)))
                .andExpect(jsonPath("$.feedTag", is("tag1")))
                .andExpect(jsonPath("$.feedTagColor", is("#777")))
                .andExpect(jsonPath("$.feedUuid", is("1100")))
                .andExpect(jsonPath("$.origin", is("http://martinfowler.com/bliki/TellDontAsk.html")))
                .andExpect(jsonPath("$.createdAt", is("1970-01-01T00:00:01.000+00:00")));

        verify(subscriptionEntryRepository).save(MockitoHamcrest.argThat(
                allOf(
                        hasProperty("id", is(1014L)),
                        hasProperty("tag", is("tag-patched")),
                        hasProperty("seen", is(true))
                )));
    }

    @Test
    public void shouldChangeTagAndSeenFlag() throws Exception {
        mockMvc.perform(patch("/api/2/subscriptionEntries/1014")
                .with(jsonBody("{'tag':'tag-patched', 'seen': false}")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.uuid", is("1014")))
                .andExpect(jsonPath("$.title", is("Bliki: TellDontAsk")))
                .andExpect(jsonPath("$.feedTitle", is("user112_subscription1")))
                .andExpect(jsonPath("$.tag", is("tag-patched")))
                .andExpect(jsonPath("$.content", is("content")))
                .andExpect(jsonPath("$.seen", is(false)))
                .andExpect(jsonPath("$.feedTag", is("tag1")))
                .andExpect(jsonPath("$.feedTagColor", is("#777")))
                .andExpect(jsonPath("$.feedUuid", is("1100")))
                .andExpect(jsonPath("$.origin", is("http://martinfowler.com/bliki/TellDontAsk.html")))
                .andExpect(jsonPath("$.createdAt", is("1970-01-01T00:00:01.000+00:00")));

        verify(subscriptionEntryRepository).save(MockitoHamcrest.argThat(
                allOf(
                        hasProperty("id", is(1014L)),
                        hasProperty("tag", is("tag-patched")),
                        hasProperty("seen", is(false))
                )));
    }
}
