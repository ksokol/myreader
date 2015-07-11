package myreader.service.search.jobs;

import myreader.entity.SubscriptionEntry;
import org.hibernate.CacheMode;
import org.hibernate.FlushMode;
import org.hibernate.ScrollMode;
import org.hibernate.ScrollableResults;
import org.hibernate.Session;
import org.hibernate.search.FullTextSession;
import org.hibernate.search.Search;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.TransactionCallbackWithoutResult;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.util.Assert;

import javax.persistence.EntityManager;

/**
 * TODO IndexSyncJob and SyndFetcherJob should be running exclusively. this prevents duplicate entries in index
 *
 * @author Kamill Sokol
 */
public class IndexSyncJob implements Runnable, ApplicationListener<ContextClosedEvent> {

    private static final Logger LOG = LoggerFactory.getLogger(IndexSyncJob.class);

    private int batchSize = 100;

    private final TransactionTemplate transactionTemplate;
    private final EntityManager em;

    private volatile boolean alive = true;

    public IndexSyncJob(EntityManager em, TransactionTemplate transactionTemplate) {
        this.em = em;
        this.transactionTemplate = transactionTemplate;
    }

	@Override
	public void run() {
		try {
			runInternal();
		} catch (Exception e) {
			LOG.error("error during index sync", e);
		}
	}

    private void runInternal() {
        transactionTemplate.execute(new TransactionCallbackWithoutResult() {
            @Override
            protected void doInTransactionWithoutResult(TransactionStatus status) {
            LOG.info("start");

            final Session session = (Session) em.getDelegate();
            FullTextSession fullTextSession = Search.getFullTextSession(session);
            fullTextSession.setFlushMode(FlushMode.MANUAL);
            fullTextSession.setCacheMode(CacheMode.IGNORE);
            fullTextSession.purgeAll(SubscriptionEntry.class);
            //Scrollable results will avoid loading too many objects in memory
            ScrollableResults results = fullTextSession.createCriteria(SubscriptionEntry.class).setFetchSize(batchSize).scroll(ScrollMode.FORWARD_ONLY);
            int index = 0;
            while (results.next() && alive) {
                index++;
                fullTextSession.index(results.get(0)); //index each element

                if (index % batchSize == 0) {
                    LOG.info("index {} items", index);
                    fullTextSession.flushToIndexes(); //apply changes to indexes
                    fullTextSession.clear(); //free memory since the queue is processed
                }
            }

            fullTextSession.flushToIndexes(); //apply changes to indexes
            fullTextSession.clear(); //free memory since the queue is processed

            LOG.info("search index sync done");
            LOG.info("end");
            }
        });
    }

    @Override
    public void onApplicationEvent(ContextClosedEvent event) {
        LOG.info("got stop signal");
        alive = false;
    }

    public void setBatchSize(final int batchSize) {
        Assert.isTrue(batchSize > 0, "batchSize less than 1");
        this.batchSize = batchSize;
    }
}
