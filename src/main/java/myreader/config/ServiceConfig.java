package myreader.config;

import myreader.fetcher.impl.FetchStatisticsMethodInterceptor;
import myreader.fetcher.SubscriptionBatch;
import myreader.fetcher.impl.SubscriptionBatchImpl;
import myreader.fetcher.SubscriptionEntryBatch;
import myreader.repository.FeedEntryRepository;
import myreader.repository.FeedRepository;
import myreader.repository.FetchStatisticRepository;
import myreader.repository.SubscriptionEntryRepository;
import myreader.repository.SubscriptionRepository;
import myreader.service.time.TimeService;

import org.springframework.aop.framework.ProxyFactoryBean;
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
    private FetchStatisticRepository fetchStatisticRepository;
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
        final SubscriptionBatch SubscriptionBatch = new SubscriptionBatchImpl(feedRepository, subscriptionEntryBatch(), subscriptionEntryRepository);
        final ProxyFactoryBean proxyFactoryBean = new ProxyFactoryBean();

        proxyFactoryBean.setTarget(SubscriptionBatch);
        proxyFactoryBean.addAdvice(new FetchStatisticsMethodInterceptor(fetchStatisticRepository, timeService));

        return (SubscriptionBatch) proxyFactoryBean.getObject();
    }
}
