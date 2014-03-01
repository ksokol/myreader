package myreader.fetcher.jobs;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import myreader.dao.SubscriptionDao;
import myreader.dao.SubscriptionEntryDao;
import myreader.entity.ExclusionPattern;
import myreader.entity.Feed;
import myreader.entity.FeedEntry;
import myreader.entity.FetchStatistics;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.fetcher.FeedParseException;
import myreader.fetcher.FeedParser;
import myreader.fetcher.FeedQueue;
import myreader.fetcher.impl.FetchResult;
import myreader.fetcher.persistence.FetcherEntry;

import myreader.repository.FeedEntryRepository;
import myreader.repository.FeedRepository;
import myreader.repository.FetchStatisticRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.BeanNameAware;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StopWatch;

class SyndFetcherJob implements Runnable, DisposableBean, BeanNameAware {

    Logger logger = LoggerFactory.getLogger(getClass());

    String jobName;

    @Autowired
    FeedParser parser;

    @Autowired
    FeedQueue feedQueue;

    @Autowired
    private FeedRepository feedRepository;

    @Autowired
    private FeedEntryRepository feedEntryRepository;

    @Autowired
    SubscriptionEntryDao subscriptionEntryDao;

    @Autowired
    SubscriptionDao subscriptionDao;

    @Autowired
    private FetchStatisticRepository fetchStatisticRepository;

    @Autowired
    private ExclusionChecker exclusionChecker;

    private volatile boolean alive = true;

    @Override
    public void run() {
        logger.debug("start");

        String origThreadName = Thread.currentThread().getName();
        Thread.currentThread().setName(this.jobName);
        StopWatch timer = new StopWatch();

        try {
            timer.start();
            String feedUrl = null;

            while ((feedUrl = feedQueue.poll()) != null && alive) {
                this.doInTransaction(feedUrl);
            }
        } finally {
            timer.stop();
            logger.debug("stop");
            logger.info("total time {} sec", timer.getTotalTimeSeconds());
            Thread.currentThread().setName(origThreadName);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    private void doInTransaction(String feedUrl) {
        FetchStatistics fetchStatistics = new FetchStatistics();

        fetchStatistics.setStartedAt(new Date());
        fetchStatistics.setUrl(feedUrl);
        fetchStatistics.setType(FetchStatistics.Type.ENTRY_LIST);
        fetchStatistics.setFetchCount(0L);
        fetchStatistics.setIssuer(Thread.currentThread().getName());

        try {
            Feed feed = feedRepository.findByUrl(feedUrl);

            if (feed != null) {
                FetchResult fetchResult = parser.parse(feedUrl);

                int fetchCount = this.process(feed, fetchResult.getEntries());

                feed.setLastModified(fetchResult.getLastModified());
                feed.setFetched(feed.getFetched() + fetchCount);

                feedRepository.save(feed);

                fetchStatistics.setFetchCount(Long.valueOf(fetchCount));
            }

            fetchStatistics.setResult(FetchStatistics.Result.SUCCESS);
        } catch (FeedParseException e) {
            fetchStatistics.setMessage(e.getMessage());
            fetchStatistics.setResult(FetchStatistics.Result.ERROR);
            fetchStatistics.setFetchCount(0L);
            logger.warn("{}: {}", feedUrl, e.getMessage());
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

    @Transactional
    private int process(Feed feed, List<FetcherEntry> fetchedEntries) {
        List<FetcherEntry> newEntries = new ArrayList<FetcherEntry>();
        int count = 0;

        for (FetcherEntry dto : fetchedEntries) {
            int result = feedEntryRepository.countByTitleOrGuidOrUrl(dto.getTitle(), dto.getGuid(), dto.getUrl());

            if (result == 0) {
                newEntries.add(dto);
            }
        }

        if (newEntries.size() > 0) {
            for (FetcherEntry dto : newEntries) {
                FeedEntry feedEntry = new FeedEntry();

                feedEntry.setContent(dto.getContent());
                feedEntry.setFeed(feed);
                feedEntry.setGuid(dto.getGuid());
                feedEntry.setTitle(dto.getTitle());
                feedEntry.setUrl(dto.getUrl());

                feedEntryRepository.save(feedEntry);

                count++;

                List<Subscription> subscriptionList = subscriptionDao.findByUrl(feed.getUrl());

                for (Subscription subscription : subscriptionList) {
                    boolean excluded = false;

                    for (ExclusionPattern ep : subscription.getExclusions()) {
                        excluded = exclusionChecker.isExcluded(ep.getPattern(), feedEntry.getTitle(),
                                feedEntry.getContent());

                        if (excluded) {
                            ep.setHitCount(ep.getHitCount() + 1);
                            break;
                        }
                    }

                    if (!excluded) {
                        SubscriptionEntry subscriptionEntry = new SubscriptionEntry();
                        subscriptionEntry.setFeedEntry(feedEntry);
                        subscriptionEntry.setSubscription(subscription);

                        subscription.setSum(subscription.getSum() + 1);

                        subscriptionEntryDao.saveOrUpdate(subscriptionEntry);
                    }

                    subscriptionDao.saveOrUpdate(subscription);
                }
            }
        }
        return count;
    }

    @Override
    public void destroy() throws Exception {
        logger.info("stop");
        this.alive = false;
    }

    @Override
    public void setBeanName(String name) {
        this.jobName = name;
    }
}
