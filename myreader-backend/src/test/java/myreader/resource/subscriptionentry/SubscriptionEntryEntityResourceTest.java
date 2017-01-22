package myreader.resource.subscriptionentry;

import myreader.entity.SubscriptionEntry;
import myreader.repository.SubscriptionEntryRepository;
import myreader.test.IntegrationTestSupport;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static myreader.test.KnownUser.USER105;
import static myreader.test.KnownUser.USER106;
import static myreader.test.KnownUser.USER110;
import static myreader.test.KnownUser.USER112;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.HttpMethod.PATCH;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.actionAsUserX;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser2;
import static org.springframework.test.web.servlet.result.ContentResultMatchersJsonAssertSupport.jsonEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author Kamill Sokol
 */
public class SubscriptionEntryEntityResourceTest extends IntegrationTestSupport {

    @Autowired
    private SubscriptionEntryRepository subscriptionEntryRepository;

    @Test
    public void testEntityResourceJsonStructureEquality() throws Exception {
        mockMvc.perform(actionAsUserX(GET, USER112, "/api/2/subscriptionEntries/1004"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscriptionentry/1004.json"));
    }

    @Test
    public void testEntityNotFound() throws Exception {
        mockMvc.perform(getAsUser2("/api/2/subscriptionEntries/1001"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testPatchSeen() throws Exception {
        SubscriptionEntry before = subscriptionEntryRepository.findOne(1004L);
        assertThat(before.isSeen(), is(true));

        mockMvc.perform(actionAsUserX(GET, USER112, "/api/2/subscriptionEntries/1004"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscriptionentry/1004.json"));

        mockMvc.perform(actionAsUserX(PATCH, USER112, "/api/2/subscriptionEntries/1004")
                .json("{'seen':false}"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscriptionentry/patch1#1004.json"));

        mockMvc.perform(actionAsUserX(GET, USER112, "/api/2/subscriptionEntries/1004"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscriptionentry/patch1#1004.json"));

        SubscriptionEntry after = subscriptionEntryRepository.findOne(1004L);
        assertThat(after.isSeen(), is(false));
    }

    @Test
    public void testPatchSeen2() throws Exception {
        SubscriptionEntry before = subscriptionEntryRepository.findOne(1022L);
        assertThat(before.isSeen(), is(false));

        mockMvc.perform(actionAsUserX(GET, USER110, "/api/2/subscriptionEntries/1022"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscriptionentry/1022.json"));

        mockMvc.perform(actionAsUserX(PATCH, USER110, "/api/2/subscriptionEntries/1022")
                .json("{'seen':true, 'tag': 'tag3'}"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscriptionentry/patch1#1022.json"));

        SubscriptionEntry after = subscriptionEntryRepository.findOne(1022L);
        assertThat(after.isSeen(), is(true));
    }

    @Test
    public void testPatchSeen3() throws Exception {
        SubscriptionEntry before = subscriptionEntryRepository.findOne(1014L);
        assertThat(before.isSeen(), is(true));

        mockMvc.perform(actionAsUserX(GET, USER105, "/api/2/subscriptionEntries/1014"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscriptionentry/1014.json"));

        mockMvc.perform(actionAsUserX(PATCH, USER105, "/api/2/subscriptionEntries/1014")
                .json("{'seen':true, 'tag': 'tag3'}"))
                .andExpect(jsonEquals("json/subscriptionentry/patch2#1014.json"));

        mockMvc.perform(actionAsUserX(GET, USER105, "/api/2/subscriptionEntries/1014"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscriptionentry/patch2#1014.json"));

        SubscriptionEntry after = subscriptionEntryRepository.findOne(1014L);
        assertThat(after.isSeen(), is(true));
    }

    @Test
    public void testPatchTag() throws Exception {
        SubscriptionEntry before = subscriptionEntryRepository.findOne(1015L);
        assertThat(before.getTag(), is("tag3"));

        mockMvc.perform(actionAsUserX(GET, USER106, "/api/2/subscriptionEntries/1015"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscriptionentry/1015.json"));

        mockMvc.perform(actionAsUserX(PATCH, USER106, "/api/2/subscriptionEntries/1015")
                .json("{'tag':'tag-patched'}"))
                .andExpect(jsonEquals("json/subscriptionentry/patch2#1015.json"));

        mockMvc.perform(actionAsUserX(GET, USER106,"/api/2/subscriptionEntries/1015"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscriptionentry/patch2#1015.json"));

        SubscriptionEntry after = subscriptionEntryRepository.findOne(1015L);
        assertThat(after.getTag(), is("tag-patched"));
    }
}
