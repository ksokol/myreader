package myreader.fetcher;

import java.util.Date;
import java.util.List;

import myreader.entity.Feed;
import myreader.entity.FetchStatistics;
import myreader.entity.SubscriptionEntry;
import myreader.fetcher.impl.FetchResult;
import myreader.repository.FeedRepository;
import myreader.repository.FetchStatisticRepository;
import myreader.repository.SubscriptionEntryRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author Kamill Sokol
 */
@Transactional
public class SubscriptionBatch {

    private static final Logger logger = LoggerFactory.getLogger(SubscriptionBatch.class);

    private final FeedParser parser;
    private final FeedRepository feedRepository;
    private final FetchStatisticRepository fetchStatisticRepository;
    private final SubscriptionEntryBatch subscriptionBatchService;
    private final SubscriptionEntryRepository subscriptionEntryRepository;

    public SubscriptionBatch(FeedParser parser, FeedRepository feedRepository, FetchStatisticRepository fetchStatisticRepository, SubscriptionEntryBatch subscriptionBatchService, SubscriptionEntryRepository subscriptionEntryRepository) {
        this.parser = parser;
        this.feedRepository = feedRepository;
        this.fetchStatisticRepository = fetchStatisticRepository;
        this.subscriptionBatchService = subscriptionBatchService;
        this.subscriptionEntryRepository = subscriptionEntryRepository;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void updateUserSubscriptions(String feedUrl) {
        FetchStatistics fetchStatistics = new FetchStatistics();
        List<SubscriptionEntry> newEntries;

        fetchStatistics.setStartedAt(new Date());
        fetchStatistics.setUrl(feedUrl);
        fetchStatistics.setType(FetchStatistics.Type.ENTRY_LIST);
        fetchStatistics.setFetchCount(0L);
        fetchStatistics.setIssuer(Thread.currentThread().getName());

        try {
            Feed feed = feedRepository.findByUrl(feedUrl);

            if (feed != null) {
                FetchResult fetchResult = parser.parse(feedUrl);

                newEntries = subscriptionBatchService.updateUserSubscriptionEntries(feed, fetchResult.getEntries());

                feed.setLastModified(fetchResult.getLastModified());
                feed.setFetched(feed.getFetched() + newEntries.size());

                feedRepository.save(feed);

                fetchStatistics.setFetchCount(Long.valueOf(newEntries.size()));
                fetchStatistics.setResult(FetchStatistics.Result.SUCCESS);

                subscriptionEntryRepository.save(newEntries);
            }

            fetchStatistics.setResult(FetchStatistics.Result.SUCCESS);
        } catch (FeedParseException e) {
            fetchStatistics.setMessage(e.getMessage());
            fetchStatistics.setResult(FetchStatistics.Result.ERROR);
            fetchStatistics.setFetchCount(0L);
            logger.warn("{}: {}", feedUrl, e.getMessage());
        }  catch (RuntimeException e) {
            fetchStatistics.setMessage(e.getMessage());
            fetchStatistics.setResult(FetchStatistics.Result.ERROR);
            fetchStatistics.setFetchCount(0L);
            throw e;
        }
        finally {
            fetchStatistics.setStoppedAt(new Date());
            fetchStatisticRepository.save(fetchStatistics);
        }
    }
}
