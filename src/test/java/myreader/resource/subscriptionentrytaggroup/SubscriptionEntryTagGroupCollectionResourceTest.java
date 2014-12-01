package myreader.resource.subscriptionentrytaggroup;

import myreader.entity.SearchableSubscriptionEntry;
import myreader.service.search.SubscriptionEntrySearchRepository;
import myreader.test.IntegrationTestSupport;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static myreader.test.KnownUser.USER3;
import static org.hamcrest.Matchers.endsWith;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser3;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser4;
import static org.springframework.test.web.servlet.result.ContentResultMatchersJsonAssertSupport.jsonEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

/**
 * @author Kamill Sokol
 */
public class SubscriptionEntryTagGroupCollectionResourceTest extends IntegrationTestSupport {

    @Autowired
    private SubscriptionEntrySearchRepository subscriptionEntrySearchRepository;

    @Test
    public void testSubscriptionEntryTagGroupResourceJsonStructureEquality() throws Exception {
        mockMvc.perform(getAsUser4("/subscriptionEntryTagGroups"))
                .andExpect(jsonEquals("json/subscriptionentrytaggroup/structure.json"));
    }

    @Test
    public void testUrlEncodingInTagAttribute() throws Exception {
        SearchableSubscriptionEntry entry = new SearchableSubscriptionEntry();
        entry.setId(42000L);
        entry.setOwnerId(USER3.id);
        entry.setTag("part1/part2");
        entry.setOwner(USER3.username);
        entry.setSubscriptionId(13L);
        subscriptionEntrySearchRepository.save(entry);

        mockMvc.perform(getAsUser3("/subscriptionEntryTagGroups"))
                .andExpect(jsonPath("content[0].links[0].href", endsWith("/tag/part1%252Fpart2")));
    }
}
