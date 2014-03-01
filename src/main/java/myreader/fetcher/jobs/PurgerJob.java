package myreader.fetcher.jobs;

import java.util.Calendar;
import java.util.Date;
import java.util.Iterator;

import myreader.entity.Feed;
import myreader.entity.FeedEntry;
import myreader.entity.SubscriptionEntry;

import myreader.repository.FeedEntryRepository;
import myreader.repository.FeedRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StopWatch;

@Component("purgerJob")
class PurgerJob implements Runnable {

    Logger logger = LoggerFactory.getLogger("myreader.PurgerJob");

    //TODO
    static Long AMOUNT = 10L;

    @Autowired
    private FeedRepository feedRepository;

    @Autowired
    private FeedEntryRepository feedEntryRepository;

    @Transactional
    @Override
    public void run() {
        StopWatch timer = new StopWatch();

        //TODO
        Calendar c = Calendar.getInstance();
        c.setTime(new Date());
        c.add(Calendar.MONTH, -6);

        final Date threshold = c.getTime();

        logger.debug("start");
        logger.info("threshold for deletion: {}", threshold);

        Iterable<Feed> feedList = feedRepository.findAll();

        timer.start();

        for (final Feed feed : feedList) {
            this.doInTransaction(feed, threshold);
        }

        timer.stop();

        logger.info("purge time {} sec", timer.getTotalTimeSeconds());
        logger.debug("stop");
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void doInTransaction(final Feed feed, final Date threshold) {
        if (feed.getSubscriptions().size() == 0) {
            feedRepository.delete(feed.getId());
            logger.info("subscriptions {}, id: {} - deleting.", feed.getSubscriptions().size(), feed.getId());
        } else {
            int count = feedEntryRepository.countByFeedAfterCreatedAt(feed, threshold);
            Iterable<FeedEntry> deprecatedEntries = feedEntryRepository.findByFeedAfterCreatedAt(feed, threshold);
            Long entryCount = feedRepository.countByFeedEntry(feed.getId());
            int deleted = 0;
            long maxToDelete = Math.min(Math.max(entryCount - AMOUNT, 0), count);

            if (logger.isDebugEnabled()) {
                logger.debug("id: {}, entryCount {}, maxToDelete {}, deprecatedEntries {}", new Object[] { feed.getId(), entryCount, maxToDelete,
                        count });
            }

            Iterator<FeedEntry> iterator = deprecatedEntries.iterator();
            for (int i = 0; i < maxToDelete && iterator.hasNext(); i++) {
                FeedEntry deprecatedEntry = iterator.next();
                boolean doDelete = true;

                for (SubscriptionEntry e : deprecatedEntry.getSubscriptionEntries()) {
                    if (e.getTag() != null) {
                        doDelete = false;
                        break;
                    }
                    if (e.isSeen() == false) {
                        doDelete = false;
                        break;
                    }
                }

                if (doDelete) {
                    logger.trace("entry {} reached threshold. deleting", deprecatedEntry.getId());
                    feedEntryRepository.delete(deprecatedEntry.getId());
                    deleted++;
                }
            }

            logger.info("max {}, deleted {}, id {}", new Object[] { maxToDelete, deleted, feed.getId() });
        }
    }
}
