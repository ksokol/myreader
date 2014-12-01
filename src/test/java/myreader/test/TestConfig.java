package myreader.test;

import myreader.fetcher.FeedParser;
import myreader.service.time.TimeService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;

import static org.mockito.Mockito.mock;

/**
 * @author Kamill Sokol
 */
@Configuration
@ComponentScan({"myreader.service","myreader.fetcher"})
public class TestConfig  {

    @Bean
    public ThreadPoolTaskScheduler myScheduler() {
        return new ThreadPoolTaskScheduler();
    }

    @Primary
    @Bean
    public FeedParser feedParser() {
        return mock(FeedParser.class);
    }

    @Primary
    @Bean
    public TimeService timeService() {
        return mock(TimeService.class);
    }

}
