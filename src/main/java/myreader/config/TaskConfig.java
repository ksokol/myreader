package myreader.config;

import myreader.fetcher.FeedQueue;
import myreader.fetcher.impl.HttpCallDecisionMaker;
import myreader.fetcher.jobs.FeedListFetcher;
import myreader.repository.FeedRepository;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
@Configuration
public class TaskConfig implements InitializingBean {

    @Autowired
    private HttpCallDecisionMaker httpCallDecisionMaker;

    @Autowired
    private FeedQueue feedQueue;

    @Autowired
    private FeedRepository feedRepository;

    @Autowired
    @Qualifier("myScheduler")
    private ThreadPoolTaskScheduler myScheduler;

    @Bean
    public FeedListFetcher feedListFetcher() {
        return new FeedListFetcher(httpCallDecisionMaker, feedQueue, feedRepository);
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        myScheduler.setWaitForTasksToCompleteOnShutdown(true);
        myScheduler.setAwaitTerminationSeconds(5);
    }
}
