package myreader.fetcher.jobs;

import java.util.Calendar;
import java.util.Date;
import java.util.Iterator;

import myreader.entity.Feed;
import myreader.entity.FeedEntry;
import myreader.entity.SubscriptionEntry;
import myreader.repository.FeedEntryRepository;
import myreader.repository.FeedRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author Kamill Sokol
 */
@Transactional
@Component("purgerJob")
public class PurgerJob extends BaseJob {

    //TODO
    private static final Long AMOUNT = 10L;

    @Autowired
    private FeedRepository feedRepository;

    @Autowired
    private FeedEntryRepository feedEntryRepository;

    public PurgerJob() {
        super("purgerJob");
    }

    @Override
    public void work() {
        //TODO
        Calendar c = Calendar.getInstance();
        c.setTime(new Date());
        c.add(Calendar.MONTH, -6);

        final Date threshold = c.getTime();

        log.debug("start");
        log.info("threshold for deletion: {}", threshold);

        Iterable<Feed> feedList = feedRepository.findAll();

        for (final Feed feed : feedList) {
            this.doInTransaction(feed, threshold);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void doInTransaction(final Feed feed, final Date threshold) {
        if (feed.getSubscriptions().size() == 0) {
            feedRepository.delete(feed.getId());
            log.info("subscriptions {}, id: {} - deleting.", feed.getSubscriptions().size(), feed.getId());
        } else {
            int count = feedEntryRepository.countByFeedAfterCreatedAt(feed, threshold);
            Iterable<FeedEntry> deprecatedEntries = feedEntryRepository.findByFeedAfterCreatedAt(feed, threshold);
            Long entryCount = feedRepository.countByFeedEntry(feed.getId());
            int deleted = 0;
            long maxToDelete = Math.min(Math.max(entryCount - AMOUNT, 0), count);

            if (log.isDebugEnabled()) {
                log.debug("id: {}, entryCount {}, maxToDelete {}, deprecatedEntries {}", new Object[] { feed.getId(), entryCount, maxToDelete,
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
                    log.trace("entry {} reached threshold. deleting", deprecatedEntry.getId());
                    feedEntryRepository.delete(deprecatedEntry.getId());
                    deleted++;
                }
            }

            log.info("max {}, deleted {}, id {}", new Object[]{maxToDelete, deleted, feed.getId()});
        }
    }
}
