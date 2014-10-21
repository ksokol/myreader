package myreader.test;

import static org.mockito.Mockito.reset;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.get;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

import javax.servlet.Filter;

import myreader.config.PersistenceConfig;
import myreader.config.SecurityConfig;
import myreader.config.TaskConfig;
import myreader.fetcher.FeedParser;
import myreader.resource.config.ResourceConfig;
import myreader.service.search.jobs.IndexSyncJob;
import myreader.service.time.TimeService;

import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.solr.core.SolrOperations;
import org.springframework.data.solr.core.query.SimpleQuery;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.context.WebApplicationContext;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {ResourceConfig.class, PersistenceConfig.class, TestDataSourceConfig.class, SecurityConfig.class, TestConfig.class, TaskConfig.class})
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
    private Filter springSecurityFilterChain;
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
                .addFilter(springSecurityFilterChain)
                .defaultRequest(get("/").contentType(MediaType.APPLICATION_JSON))
                .build();

        solrOperations.delete(new SimpleQuery("*:*"));
        solrOperations.commit();
        indexSyncJob.run();
		beforeTest();
    }

	protected void beforeTest() throws Exception {}

}
