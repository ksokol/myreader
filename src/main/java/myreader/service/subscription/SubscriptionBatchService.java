package myreader.service.subscription;

/**
 * @author Kamill Sokol
 */
public interface SubscriptionBatchService {

    @Deprecated
    void updateUserSubscriptions(String feedUrl);

    void calculateUnseenAggregate();
}
