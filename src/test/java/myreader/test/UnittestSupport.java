package myreader.test;

import myreader.config.PersistenceConfig;

import myreader.config.SecurityConfig;
import myreader.config.TaskConfig;
import myreader.fetcher.FeedParser;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

import static org.mockito.Mockito.reset;

/**
 * @author Kamill Sokol
 *
 * use {@link myreader.test.IntegrationTestSupport} instead
 *
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {PersistenceConfig.class, TestDataSourceConfig.class, SecurityConfig.class, TestConfig.class, TaskConfig.class})
@Transactional
@Deprecated
public class UnittestSupport {

    @Autowired
    private FeedParser feedParserMock;

    @Before
    public void before() {
        reset(feedParserMock);
    }
}
