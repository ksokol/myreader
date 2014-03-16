package myreader.service.subscriptionentry;

import myreader.entity.Feed;
import myreader.entity.SubscriptionEntry;
import myreader.fetcher.persistence.FetcherEntry;

import java.util.List;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
public interface SubscriptionEntryBatchService {

    @Deprecated
    List<SubscriptionEntry> updateUserSubscriptionEntries(Feed feed, List<FetcherEntry> fetchedEntries);
}
