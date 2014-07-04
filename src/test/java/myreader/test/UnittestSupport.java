package myreader.test;

import myreader.config.PersistenceConfig;
import myreader.config.SearchConfig;
import myreader.config.SecurityConfig;
import myreader.config.TaskConfig;
import myreader.fetcher.FeedParser;
import myreader.resource.config.ResourceConfig;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.transaction.annotation.Transactional;

import static org.mockito.Mockito.reset;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {ResourceConfig.class, PersistenceConfig.class, TestDataSourceConfig.class, SearchConfig.class, SecurityConfig.class, TestConfig.class, TaskConfig.class})
@WebAppConfiguration
@Transactional
public class UnittestSupport {

    @Autowired
    private FeedParser feedParserMock;

    @Before
    public void before() {
        reset(feedParserMock);
    }
}
