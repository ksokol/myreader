package myreader.service.subscription.impl;

import myreader.entity.Feed;
import myreader.entity.FetchStatistics;
import myreader.entity.SubscriptionEntry;
import myreader.fetcher.FeedParseException;
import myreader.fetcher.FeedParser;
import myreader.fetcher.impl.FetchResult;
import myreader.repository.FeedRepository;
import myreader.repository.FetchStatisticRepository;
import myreader.service.search.SubscriptionEntrySearchService;
import myreader.service.subscription.SubscriptionBatchService;
import myreader.service.subscriptionentry.SubscriptionEntryBatchService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
@Transactional
@Service
public class SubscriptionBatchServiceImpl implements SubscriptionBatchService {

    private static final Logger logger = LoggerFactory.getLogger(SubscriptionBatchServiceImpl.class);

    private final FeedParser parser;
    private final FeedRepository feedRepository;
    private final FetchStatisticRepository fetchStatisticRepository;
    private final SubscriptionEntryBatchService subscriptionBatchService;
    private final SubscriptionEntrySearchService searchService;

    @Autowired
    public SubscriptionBatchServiceImpl(FeedParser parser, FeedRepository feedRepository, FetchStatisticRepository fetchStatisticRepository, SubscriptionEntryBatchService subscriptionBatchService, SubscriptionEntrySearchService searchService) {
        this.parser = parser;
        this.feedRepository = feedRepository;
        this.fetchStatisticRepository = fetchStatisticRepository;
        this.subscriptionBatchService = subscriptionBatchService;
        this.searchService = searchService;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Override
    public void updateUserSubscriptions(String feedUrl) {
        FetchStatistics fetchStatistics = new FetchStatistics();
        List<SubscriptionEntry> newEntries = null;

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
                searchService.save(newEntries);
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
