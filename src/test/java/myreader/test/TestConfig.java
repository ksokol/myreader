package myreader.test;

import myreader.fetcher.FeedParser;
import org.springframework.context.annotation.*;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;

import javax.sql.DataSource;

import static org.mockito.Mockito.mock;

/**
 * @author Kamill Sokol
 */
@Configuration
@ComponentScan({"myreader.service","myreader.fetcher"})
public class TestConfig  {

    @Bean
    @DependsOn("entityManagerFactory")
    public ResourceDatabasePopulator initDatabase(DataSource dataSource) throws Exception {
        ResourceDatabasePopulator populator = new ResourceDatabasePopulator();
        populator.addScript(new ClassPathResource("test-data.sql"));
        populator.populate(dataSource.getConnection());
        return populator;
    }

    @Bean
    public ThreadPoolTaskScheduler myScheduler() {
        return new ThreadPoolTaskScheduler();
    }

    @Primary
    @Bean
    public FeedParser feedParser() {
        return mock(FeedParser.class);
    }

}
