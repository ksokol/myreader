package myreader.fetcher;

import myreader.entity.Feed;
import myreader.entity.FetchStatistics;
import myreader.entity.SubscriptionEntry;
import myreader.fetcher.persistence.FetchResult;
import myreader.repository.FeedRepository;
import myreader.repository.FetchStatisticRepository;
import myreader.repository.SubscriptionEntryRepository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

/**
 * @author Kamill Sokol
 */
@Transactional
public class SubscriptionBatch {

    private final FeedRepository feedRepository;
    private final FetchStatisticRepository fetchStatisticRepository;
    private final SubscriptionEntryBatch subscriptionBatchService;
    private final SubscriptionEntryRepository subscriptionEntryRepository;

    public SubscriptionBatch(FeedRepository feedRepository, FetchStatisticRepository fetchStatisticRepository, SubscriptionEntryBatch subscriptionBatchService, SubscriptionEntryRepository subscriptionEntryRepository) {
        this.feedRepository = feedRepository;
        this.fetchStatisticRepository = fetchStatisticRepository;
        this.subscriptionBatchService = subscriptionBatchService;
        this.subscriptionEntryRepository = subscriptionEntryRepository;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void updateUserSubscriptions(FetchResult fetchResult) {
        FetchStatistics fetchStatistics = new FetchStatistics();
        List<SubscriptionEntry> newEntries;

        fetchStatistics.setStartedAt(new Date());
        fetchStatistics.setUrl(fetchResult.getUrl());
        fetchStatistics.setType(FetchStatistics.Type.ENTRY_LIST);
        fetchStatistics.setFetchCount(0L);
        fetchStatistics.setIssuer(Thread.currentThread().getName());

        try {
            Feed feed = feedRepository.findByUrl(fetchResult.getUrl());

            if (feed != null) {
                newEntries = subscriptionBatchService.updateUserSubscriptionEntries(feed, fetchResult.getEntries());

                feed.setLastModified(fetchResult.getLastModified());
                feed.setFetched(feed.getFetched() + newEntries.size());

                feedRepository.save(feed);

                fetchStatistics.setFetchCount(Long.valueOf(newEntries.size()));
                fetchStatistics.setResult(FetchStatistics.Result.SUCCESS);

                subscriptionEntryRepository.save(newEntries);
            }

            fetchStatistics.setResult(FetchStatistics.Result.SUCCESS);
        } catch (RuntimeException e) {
            fetchStatistics.setMessage(e.getMessage());
            fetchStatistics.setResult(FetchStatistics.Result.ERROR);
            fetchStatistics.setFetchCount(0L);
            throw e;
        } finally {
            fetchStatistics.setStoppedAt(new Date());
            fetchStatisticRepository.save(fetchStatistics);
        }
    }
}
