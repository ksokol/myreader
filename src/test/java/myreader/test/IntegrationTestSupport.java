package myreader.test;

import static org.mockito.Mockito.reset;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.get;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

import myreader.config.CommonConfig;
import myreader.config.PersistenceConfig;
import myreader.config.ServiceConfig;
import myreader.fetcher.FeedParser;
import myreader.resource.config.ResourceConfig;
import myreader.service.search.jobs.IndexSyncJob;
import myreader.service.time.TimeService;

import org.junit.After;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.context.WebApplicationContext;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {CommonConfig.class, ResourceConfig.class, PersistenceConfig.class, TestDataSourceConfig.class, TestConfig.class, ServiceConfig.class})
@WebAppConfiguration
@TestPropertySource(properties = { "task.enabled = false" })
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class IntegrationTestSupport {

	static {
        //TODO move to src/test/resources/application.properties
		System.setProperty("hibernate.search.default.directory_provider","ram");
		System.setProperty("hibernate.search.lucene_version","LUCENE_41");
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

    @Before
    public final void before() throws Exception {
        reset(timeService);
        reset(feedParserMock);

        this.mockMvc = webAppContextSetup(this.wac)
                .defaultRequest(get("/").contentType(MediaType.APPLICATION_JSON))
                .build();

        indexSyncJob.run();
		beforeTest();
    }

    @After
    public final void after() {
        SecurityContextHolder.getContext().setAuthentication(null);
    }

	protected void beforeTest() throws Exception {}

}
