package myreader.test;

import myreader.config.PersistenceConfig;
import myreader.config.SearchConfig;
import myreader.config.SecurityConfig;
import myreader.config.TaskConfig;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {PersistenceConfig.class, TestDataSourceConfig.class, SearchConfig.class, SecurityConfig.class, TestConfig.class, TaskConfig.class})
@Transactional
public class UnittestSupport {
}
