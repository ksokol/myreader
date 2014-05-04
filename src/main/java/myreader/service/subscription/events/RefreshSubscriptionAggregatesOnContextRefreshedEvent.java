package myreader.service.subscription.events;

import myreader.service.subscription.SubscriptionBatchService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

/**
 * @author Kamill Sokol
 */
@Profile("myreader.prod")
@Component
public class RefreshSubscriptionAggregatesOnContextRefreshedEvent implements ApplicationListener<ContextRefreshedEvent> {

    private static Logger log = LoggerFactory.getLogger(RefreshSubscriptionAggregatesOnContextRefreshedEvent.class);

    private final SubscriptionBatchService subscriptionbatchService;
    private static volatile boolean done;

    @Autowired
    public RefreshSubscriptionAggregatesOnContextRefreshedEvent(SubscriptionBatchService subscriptionbatchService) {
        this.subscriptionbatchService = subscriptionbatchService;
    }

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        synchronized (RefreshSubscriptionAggregatesOnContextRefreshedEvent.class) {
            if(done) {
                log.info("unseen aggregates calculated. skipping");
                return;
            }

            log.info("about to calculate unseen aggregates.");

            try {
                subscriptionbatchService.calculateUnseenAggregate();
            } catch(Exception e) {
                log.error("caught exception", e);
            } finally {
                done = true;
            }
        }
    }

}
