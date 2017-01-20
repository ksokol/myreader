package myreader.resource.subscription;

import myreader.test.IntegrationTestSupport;
import myreader.test.KnownUser;
import org.junit.Test;
import org.springframework.http.HttpMethod;

import static myreader.test.KnownUser.USER104;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.springframework.http.HttpMethod.PATCH;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.actionAsUserX;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.deleteAsUser1;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser1;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser103;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.patchAsUser103;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.patchAsUser2;
import static org.springframework.test.web.servlet.result.ContentResultMatchersJsonAssertSupport.jsonEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author Kamill Sokol
 */
public class SubscriptionEntityResourceTest extends IntegrationTestSupport {

    @Test
    public void testEntityResourceJsonStructureEquality() throws Exception {
        mockMvc.perform(getAsUser1("/api/2/subscriptions/1"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscription/structure-1.json"));
    }

    @Test
    public void testNotFoundWhenGetNotOwnSubscription() throws Exception {
        mockMvc.perform(getAsUser1("/api/2/subscriptions/6"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testDelete() throws Exception {
        mockMvc.perform(getAsUser1("/api/2/subscriptions?unseenGreaterThan=-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content..origin", hasSize(5)))
                .andExpect(jsonPath("$.content..origin", hasItem("http://feeds.feedburner.com/javaposse")));

        mockMvc.perform(deleteAsUser1("/api/2/subscriptions/1"))
                .andExpect(status().isNoContent());

        mockMvc.perform(getAsUser1("/api/2/subscriptions?unseenGreaterThan=-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content..origin", hasSize(4)))
                .andExpect(jsonPath("$.content..origin", not(hasItem("http://feeds.feedburner.com/javaposse"))));
    }

    @Test
    public void testNotFoundWhenPatchNotOwnSubscription() throws Exception {
        mockMvc.perform(patchAsUser2("/api/2/subscriptions/1")
                .json("{ 'title': 'irrelevant',  'tag' : 'irrelevant' }"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testPatchableProperties() throws Exception {
        mockMvc.perform(actionAsUserX(PATCH, USER104, "/api/2/subscriptions/102")
                .json("json/subscription/patchable-properties1-102.json"))
                .andExpect(jsonEquals("json/subscription/patchable-properties2-102.json"));
    }

    @Test
    public void testPatch() throws Exception {
        mockMvc.perform(getAsUser103("/api/2/subscriptions/101"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscription/101.json"));

        mockMvc.perform(patchAsUser103("/api/2/subscriptions/101")
                .json("{ 'title': 'user103_subscription1', 'tag':'test1'}"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscription/patch1-101.json"));

        mockMvc.perform(patchAsUser103("/api/2/subscriptions/101")
                .json("{'title': 'user103_subscription1', 'tag': null}"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscription/patch2-101.json"));

        mockMvc.perform(patchAsUser103("/api/2/subscriptions/101")
                .json("{'title':'test2','tag':'test2'}"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscription/patch3-101.json"));

        mockMvc.perform(getAsUser103("/api/2/subscriptions/101"))
                .andExpect(status().isOk())
                .andExpect(jsonEquals("json/subscription/patch3-101.json"));
    }

    @Test
    public void shouldValidatePatchRequest() throws Exception {
        mockMvc.perform(actionAsUserX(HttpMethod.PATCH, KnownUser.USER103, "/api/2/subscriptions/101")
                .json("{ 'title': ' '}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("status", is(400)))
                .andExpect(jsonPath("message", is("validation error")))
                .andExpect(jsonPath("fieldErrors..field", containsInAnyOrder("title")))
                .andExpect(jsonPath("fieldErrors..message", hasItems("may not be empty")));
    }
}
