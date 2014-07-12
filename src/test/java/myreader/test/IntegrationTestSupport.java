package myreader.test;

import myreader.config.PersistenceConfig;

import myreader.config.SecurityConfig;
import myreader.config.TaskConfig;
import myreader.fetcher.FeedParser;
import myreader.resource.config.ResourceConfig;
import myreader.service.time.TimeService;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.solr.core.SolrTemplate;
import org.springframework.data.solr.core.query.Criteria;
import org.springframework.data.solr.core.query.SimpleFilterQuery;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import javax.servlet.Filter;

import static org.mockito.Mockito.reset;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {ResourceConfig.class, PersistenceConfig.class, TestDataSourceConfig.class, SecurityConfig.class, TestConfig.class, TaskConfig.class})
@WebAppConfiguration
@Transactional
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
	private SolrTemplate solrTemplate;
    @Autowired
    private FeedParser feedParserMock;

    @Before
    public final void before() throws Exception {
        reset(timeService);
        reset(feedParserMock);
		clearSearchIndex();

        this.mockMvc = webAppContextSetup(this.wac)
                .addFilter(springSecurityFilterChain)
                .defaultRequest(get("/").contentType(MediaType.APPLICATION_JSON))
                .alwaysDo(print())
                .build();

		beforeTest();
    }

	protected void beforeTest() throws Exception {}

	private void clearSearchIndex() {
		solrTemplate.delete(new SimpleFilterQuery(new Criteria(Criteria.WILDCARD).expression(Criteria.WILDCARD)));
		solrTemplate.commit();
	}

}
