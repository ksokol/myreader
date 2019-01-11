package myreader.resource.subscriptionentry;

import myreader.entity.SubscriptionEntry;
import myreader.repository.SubscriptionEntryRepository;
import myreader.test.TestConstants;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.TimeZone;

import static myreader.test.request.JsonRequestPostProcessors.jsonBody;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
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
@TestPropertySource(properties = { "task.enabled = false" })
@Sql("classpath:test-data.sql")
public class SubscriptionEntryEntityResourceTests {

    static {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SubscriptionEntryRepository subscriptionEntryRepository;

    @Test
    @WithMockUser(TestConstants.USER112)
    public void shouldReturnExpectedJsonStructure() throws Exception {
        mockMvc.perform(get("/api/2/subscriptionEntries/1004"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.uuid", is("1004")))
                .andExpect(jsonPath("$.title", is("Bliki: TellDontAsk")))
                .andExpect(jsonPath("$.feedTitle", is("user112_subscription1")))
                .andExpect(jsonPath("$.tag", is("tag3")))
                .andExpect(jsonPath("$.content", is("content")))
                .andExpect(jsonPath("$.seen", is(true)))
                .andExpect(jsonPath("$.feedTag", is("tag1")))
                .andExpect(jsonPath("$.feedTagColor", is("#777")))
                .andExpect(jsonPath("$.feedUuid", is("1100")))
                .andExpect(jsonPath("$.origin", is("http://martinfowler.com/bliki/TellDontAsk.html")))
                .andExpect(jsonPath("$.createdAt", is("2011-04-15T19:20:46.000+0000")));
    }

    @Test
    @WithMockUser(TestConstants.USER2)
    public void shouldReturnNotFound() throws Exception {
        mockMvc.perform(get("/api/2/subscriptionEntries/1001"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(TestConstants.USER112)
    public void shouldSetSeenFlagFromTrueToFalse() throws Exception {
        SubscriptionEntry before = subscriptionEntryRepository.findById(1004L).orElseThrow(AssertionError::new);
        assertThat(before.isSeen(), is(true));

        mockMvc.perform(get("/api/2/subscriptionEntries/1004"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("seen", is(true)));

        mockMvc.perform(patch("/api/2/subscriptionEntries/1004")
                .with(jsonBody("{'seen':false}")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("seen", is(false)));

        mockMvc.perform(get("/api/2/subscriptionEntries/1004"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("seen", is(false)));

        SubscriptionEntry after = subscriptionEntryRepository.findById(1004L).orElseThrow(AssertionError::new);
        assertThat(after.isSeen(), is(false));
    }

    @Test
    @WithMockUser(TestConstants.USER110)
    public void shouldSetSeenFlagFromFalseToTrue() throws Exception {
        SubscriptionEntry before = subscriptionEntryRepository.findById(1022L).orElseThrow(AssertionError::new);
        assertThat(before.isSeen(), is(false));

        mockMvc.perform(get("/api/2/subscriptionEntries/1022"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("seen", is(false)));

        mockMvc.perform(patch("/api/2/subscriptionEntries/1022")
                .with(jsonBody("{'seen':true}")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("seen", is(true)));

        SubscriptionEntry after = subscriptionEntryRepository.findById(1022L).orElseThrow(AssertionError::new);
        assertThat(after.isSeen(), is(true));
    }

    @Test
    @WithMockUser(TestConstants.USER105)
    public void shouldNotChangeSeen() throws Exception {
        SubscriptionEntry before = subscriptionEntryRepository.findById(1014L).orElseThrow(AssertionError::new);
        assertThat(before.isSeen(), is(true));

        mockMvc.perform(get("/api/2/subscriptionEntries/1014"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("seen", is(true)));

        mockMvc.perform(patch("/api/2/subscriptionEntries/1014")
                .with(jsonBody("{'seen':true}")))
                .andExpect(jsonPath("seen", is(true)));

        mockMvc.perform(get("/api/2/subscriptionEntries/1014"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("seen", is(true)));

        SubscriptionEntry after = subscriptionEntryRepository.findById(1014L).orElseThrow(AssertionError::new);
        assertThat(after.isSeen(), is(true));
    }

    @Test
    @WithMockUser(TestConstants.USER106)
    public void shouldChangeTag() throws Exception {
        SubscriptionEntry before = subscriptionEntryRepository.findById(1015L).orElseThrow(AssertionError::new);
        assertThat(before.getTag(), is("tag3"));

        mockMvc.perform(get("/api/2/subscriptionEntries/1015"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("tag", is("tag3")));

        mockMvc.perform(patch("/api/2/subscriptionEntries/1015")
                .with(jsonBody("{'tag':'tag-patched'}")))
                .andExpect(jsonPath("tag", is("tag-patched")));

        mockMvc.perform(get("/api/2/subscriptionEntries/1015"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("tag", is("tag-patched")));

        SubscriptionEntry after = subscriptionEntryRepository.findById(1015L).orElseThrow(AssertionError::new);
        assertThat(after.getTag(), is("tag-patched"));
    }
}
