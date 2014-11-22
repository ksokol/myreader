package myreader.test;

import myreader.config.PersistenceConfig;
import myreader.config.TaskConfig;
import myreader.fetcher.FeedParser;
import myreader.resource.config.ResourceConfig;
import myreader.service.search.jobs.IndexSyncJob;
import myreader.service.time.TimeService;
import org.junit.After;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.solr.core.SolrOperations;
import org.springframework.data.solr.core.query.SimpleQuery;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.context.WebApplicationContext;

import static org.mockito.Mockito.reset;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.get;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {ResourceConfig.class, PersistenceConfig.class, TestDataSourceConfig.class, TestConfig.class, TaskConfig.class})
@WebAppConfiguration
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class IntegrationTestSupport {

	static {
		System.setProperty("solr.directoryFactory","org.apache.solr.core.RAMDirectoryFactory");
		System.setProperty("solr.lockType","single");
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
    private SolrOperations solrOperations;

    @Before
    public final void before() throws Exception {
        reset(timeService);
        reset(feedParserMock);

        this.mockMvc = webAppContextSetup(this.wac)
                .defaultRequest(get("/").contentType(MediaType.APPLICATION_JSON))
                .build();

        solrOperations.delete(new SimpleQuery("*:*"));
        solrOperations.commit();
        indexSyncJob.run();
		beforeTest();
    }

    @After
    public final void after() {
        SecurityContextHolder.getContext().setAuthentication(null);
    }

	protected void beforeTest() throws Exception {}

}
