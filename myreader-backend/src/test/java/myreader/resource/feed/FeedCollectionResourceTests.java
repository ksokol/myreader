package myreader.resource.feed;

import myreader.service.search.jobs.IndexSyncJob;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.TimeZone;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.getAsUser2;
import static org.springframework.test.web.servlet.result.ContentResultMatchersJsonAssertSupport.jsonEquals;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@SpringBootTest
@TestPropertySource(properties = { "task.enabled = false" })
public class FeedCollectionResourceTests { //extends IntegrationTestSupport {

    static {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
        System.setProperty("file.encoding", "UTF-8");
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private IndexSyncJob indexSyncJob;

    @Before
    public void setUp() throws Exception {
        indexSyncJob.work();
    }

    @Test
    public void testCollectionResource() throws Exception {
        mockMvc.perform(getAsUser2("/api/2/feeds"))
                .andExpect(jsonEquals("json/feeds/getResponse.json"));
    }

}
