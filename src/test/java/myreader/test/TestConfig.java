package myreader.test;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;

import javax.sql.DataSource;

/**
 * @author Kamill Sokol dev@sokol-web.de
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

}
