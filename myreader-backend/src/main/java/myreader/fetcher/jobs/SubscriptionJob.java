package myreader.fetcher.jobs;

import myreader.fetcher.SubscriptionEntryBatch;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * @author Kamill Sokol
 */
@Component
@ConditionalOnTaskEnabled
public class SubscriptionJob extends BaseJob {

    private final SubscriptionEntryBatch subscriptionBatchService;

    public SubscriptionJob(SubscriptionEntryBatch subscriptionBatchService) {
        super("subscriptionJob");
        this.subscriptionBatchService = subscriptionBatchService;
    }

    @Scheduled(fixedRate = 300000)
    @Override
    public void work() {
        subscriptionBatchService.updateUserSubscriptionEntries();
    }
}
