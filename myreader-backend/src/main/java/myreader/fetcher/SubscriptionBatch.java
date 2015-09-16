package myreader.fetcher;

import myreader.fetcher.persistence.FetchResult;

/**
 * @author Kamill Sokol
 */
public interface SubscriptionBatch {

    long updateUserSubscriptions(FetchResult fetchResult);
}
