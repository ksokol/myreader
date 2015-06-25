package myreader.resource.subscriptionentry;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser1;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser2;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.patchAsUser1;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.patchAsUser2;
import static org.springframework.test.web.servlet.result.ContentResultMatchersJsonAssertSupport.jsonEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import myreader.entity.SubscriptionEntry;
import myreader.repository.SubscriptionEntryRepository;
import myreader.repository.SubscriptionRepository;
import myreader.test.IntegrationTestSupport;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * @author Kamill Sokol
 */
public class SubscriptionEntryEntityResourceTest extends IntegrationTestSupport {

    @Autowired
    private SubscriptionEntryRepository subscriptionEntryRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Test
    public void testEntityResourceJsonStructureEquality() throws Exception {
        mockMvc.perform(getAsUser2("/subscriptionEntries/1004"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscriptionentry/4.json"));
    }

    @Test
    public void testEntityNotFound() throws Exception {
        mockMvc.perform(getAsUser2("/subscriptionEntries/1001"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testPatchSeen() throws Exception {
        SubscriptionEntry before = subscriptionEntryRepository.findOne(1004L);
        assertThat(before.isSeen(), is(true));
        assertThat(subscriptionRepository.findOne(7L).getUnseen(), is(0));

        mockMvc.perform(getAsUser2("/subscriptionEntries/1004"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscriptionentry/4.json"));

        mockMvc.perform(patchAsUser2("/subscriptionEntries/1004")
                .json("{'seen':false}"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscriptionentry/patch1#4.json"));

        mockMvc.perform(getAsUser2("/subscriptionEntries/1004"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscriptionentry/patch1#4.json"));

        SubscriptionEntry after = subscriptionEntryRepository.findOne(1004L);
        assertThat(after.isSeen(), is(false));
        assertThat(subscriptionRepository.findOne(7L).getUnseen(), is(1));
    }

    @Test
    public void testPatchSeen2() throws Exception {
        SubscriptionEntry before = subscriptionEntryRepository.findOne(1001L);
        assertThat(before.isSeen(), is(false));
        assertThat(subscriptionRepository.findOne(3L).getUnseen(), is(0));

        mockMvc.perform(getAsUser1("/subscriptionEntries/1001"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscriptionentry/1001.json"));

        mockMvc.perform(patchAsUser1("/subscriptionEntries/1001")
                .json("{'seen':true}"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscriptionentry/patch1#1001.json"));

        SubscriptionEntry after = subscriptionEntryRepository.findOne(1001L);
        assertThat(after.isSeen(), is(true));
        assertThat(subscriptionRepository.findOne(3L).getUnseen(), is(-1));
    }

    @Test
    public void testPatchSeen3() throws Exception {
        SubscriptionEntry before = subscriptionEntryRepository.findOne(1004L);
        assertThat(before.isSeen(), is(true));
        assertThat(subscriptionRepository.findOne(7L).getUnseen(), is(0));

        mockMvc.perform(getAsUser2("/subscriptionEntries/1004"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscriptionentry/4.json"));

        mockMvc.perform(patchAsUser2("/subscriptionEntries/1004")
                .json("{'seen':true}"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscriptionentry/4.json"));

        mockMvc.perform(getAsUser2("/subscriptionEntries/1004"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscriptionentry/4.json"));

        SubscriptionEntry after = subscriptionEntryRepository.findOne(1004L);
        assertThat(after.isSeen(), is(true));
        assertThat(subscriptionRepository.findOne(7L).getUnseen(), is(0));
    }

    @Test
    public void testPatchTag() throws Exception {
        SubscriptionEntry before = subscriptionEntryRepository.findOne(1004L);
        assertThat(before.getTag(), is("tag3"));

        mockMvc.perform(getAsUser2("/subscriptionEntries/1004"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscriptionentry/4.json"));

        mockMvc.perform(patchAsUser2("/subscriptionEntries/1004")
                .json("{'tag':'tag-patched'}"))
                .andExpect(jsonEquals("json/subscriptionentry/patch2#4.json"));

        mockMvc.perform(getAsUser2("/subscriptionEntries/1004"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscriptionentry/patch2#4.json"));

        SubscriptionEntry after = subscriptionEntryRepository.findOne(1004L);
        assertThat(after.getTag(), is("tag-patched"));
    }

}
