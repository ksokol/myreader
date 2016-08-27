package myreader.test;

import myreader.Starter;
import myreader.fetcher.FeedParser;
import myreader.fetcher.FeedQueue;
import myreader.service.search.jobs.IndexSyncJob;
import myreader.service.time.TimeService;
import org.junit.After;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.boot.test.WebIntegrationTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.context.WebApplicationContext;

import java.util.TimeZone;

import static org.mockito.Mockito.reset;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.get;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = { Starter.class, TestConfig.class, TestDataSourceConfig.class} )
@WebIntegrationTest("server.port:0")
@TestPropertySource(properties = { "task.enabled = false" })
public abstract class IntegrationTestSupport {

	static {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
        System.setProperty("file.encoding", "UTF-8");
	}

    protected MockMvc mockMvc;

    @Autowired
    protected WebApplicationContext wac;
    @Autowired
    private TimeService timeService;
    @Autowired
    private FeedParser feedParserMock;
    @Autowired
    private IndexSyncJob indexSyncJob;
    @Autowired
    private FeedQueue feedQueueMock;

    @Before
    public final void before() throws Exception {
        reset(timeService, feedParserMock, feedQueueMock);

        this.mockMvc = webAppContextSetup(this.wac)
                .defaultRequest(get("/").contentType(MediaType.APPLICATION_JSON))
                .build();

        indexSyncJob.run();
		beforeTest();
    }

    @After
    public final void after() throws Exception {
        SecurityContextHolder.getContext().setAuthentication(null);
        afterTest();
    }

	protected void beforeTest() throws Exception {
        //used by child class
    }

    protected void afterTest() throws Exception {
        //used by child class
    }
}
