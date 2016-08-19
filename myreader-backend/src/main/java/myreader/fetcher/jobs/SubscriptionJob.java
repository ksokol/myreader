package myreader.fetcher.jobs;

import myreader.fetcher.SubscriptionEntryBatch;

/**
 * @author Kamill Sokol
 */
public class SubscriptionJob extends BaseJob {

    private final SubscriptionEntryBatch subscriptionBatchService;

    public SubscriptionJob(String jobName, SubscriptionEntryBatch subscriptionBatchService) {
        super(jobName);
        this.subscriptionBatchService = subscriptionBatchService;
    }

    @Override
    public void work() {
        subscriptionBatchService.updateUserSubscriptionEntries();
    }
}
