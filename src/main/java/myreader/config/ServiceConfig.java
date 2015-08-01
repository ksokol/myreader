package myreader.config;

import myreader.fetcher.SubscriptionBatch;
import myreader.fetcher.SubscriptionEntryBatch;
import myreader.fetcher.impl.SubscriptionBatchImpl;
import myreader.repository.FeedEntryRepository;
import myreader.repository.FeedRepository;
import myreader.repository.SubscriptionEntryRepository;
import myreader.repository.SubscriptionRepository;
import myreader.service.time.TimeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author Kamill Sokol
 */
@Configuration
public class ServiceConfig {

    @Autowired
    private FeedRepository feedRepository;
    @Autowired
    private FeedEntryRepository feedEntryRepository;
    @Autowired
    private SubscriptionRepository subscriptionRepository;
    @Autowired
    private SubscriptionEntryRepository subscriptionEntryRepository;
    @Autowired
    private TimeService timeService;

    @Bean
    public SubscriptionEntryBatch subscriptionEntryBatch() {
        return new SubscriptionEntryBatch(feedEntryRepository, subscriptionRepository, subscriptionEntryRepository, timeService);
    }

    @Bean
    public SubscriptionBatch subscriptionBatch() {
        return new SubscriptionBatchImpl(feedRepository, subscriptionEntryBatch(), subscriptionEntryRepository);
    }
}
