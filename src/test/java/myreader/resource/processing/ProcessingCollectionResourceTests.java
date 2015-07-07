package myreader.resource.processing;

import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsAdmin;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.putAsAdmin;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import myreader.fetcher.FeedQueue;
import myreader.test.IntegrationTestSupport;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Collections;

/**
 * @author Kamill Sokol
 */
public class ProcessingCollectionResourceTests extends IntegrationTestSupport {

    @Autowired
    private FeedQueue feedQueue;

    @Test
    public void processingFeedsEmpty() throws Exception {
        mockMvc.perform(getAsAdmin("/processing/feeds"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("page.totalElements", is(0)));
    }

    @Test
    public void processingFeeds() throws Exception {
        when(feedQueue.getSnapshot()).thenReturn(Collections.singletonList("http://feeds.feedburner.com/javaposse"));

        mockMvc.perform(getAsAdmin("/processing/feeds"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("content..origin", hasItem("http://feeds.feedburner.com/javaposse")))
                .andExpect(jsonPath("page.totalElements", is(1)));
    }

    @Test
    public void processingFeeds2() throws Exception {
        mockMvc.perform(putAsAdmin("/processing")
                .json("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("status", is(400)))
                .andExpect(jsonPath("message", is("validation error")))
                .andExpect(jsonPath("fieldErrors", hasSize(1)))
                .andExpect(jsonPath("fieldErrors[0].field", is("process")))
                .andExpect(jsonPath("fieldErrors[0].message", is("process does not exists")));
    }

    @Test
    public void processingFeeds22() throws Exception {
        mockMvc.perform(putAsAdmin("/processing")
                .json("{ 'process': 'indexSyncJob' }"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("done", is(false)))
                .andExpect(jsonPath("cancelled", is(false)));
    }
}
