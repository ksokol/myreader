package myreader.service.search.jobs;

import myreader.entity.SubscriptionEntry;
import myreader.fetcher.jobs.BaseJob;
import org.hibernate.CacheMode;
import org.hibernate.FlushMode;
import org.hibernate.ScrollMode;
import org.hibernate.ScrollableResults;
import org.hibernate.Session;
import org.hibernate.search.FullTextSession;
import org.hibernate.search.Search;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

import javax.persistence.EntityManager;

import static java.util.Objects.requireNonNull;

/**
 * TODO IndexSyncJob and SyndFetcherJob should be running exclusively. this prevents duplicate entries in index
 *
 * @author Kamill Sokol
 */

@Component
public class IndexSyncJob extends BaseJob {

    private int batchSize = 100;

    private final EntityManager entityManager;

    public IndexSyncJob(EntityManager entityManager) {
        super("indexSyncJob");
        this.entityManager = requireNonNull(entityManager, "entityManager is null");
    }

    @Override
    public void work() {
        getLog().info("start");

        final Session session = (Session) entityManager.getDelegate();
        FullTextSession fullTextSession = Search.getFullTextSession(session);
        fullTextSession.setHibernateFlushMode(FlushMode.MANUAL);
        fullTextSession.setCacheMode(CacheMode.IGNORE);
        fullTextSession.purgeAll(SubscriptionEntry.class);
        //Scrollable results will avoid loading too many objects in memory
        ScrollableResults results = session.createQuery("select se from SubscriptionEntry as se")
                .setFetchSize(batchSize)
                .scroll(ScrollMode.FORWARD_ONLY);
        int index = 0;
        while (results.next() && isAlive()) {
            index++;
            fullTextSession.index(results.get(0)); //index each element

            if (index % batchSize == 0) {
                getLog().info("index {} items", index);
                fullTextSession.flushToIndexes(); //apply changes to indexes
                fullTextSession.clear(); //free memory since the queue is processed
            }
        }

        fullTextSession.flushToIndexes(); //apply changes to indexes
        fullTextSession.clear(); //free memory since the queue is processed

        getLog().info("search index sync done");
        getLog().info("end");
    }

    void setBatchSize(final int batchSize) {
        Assert.isTrue(batchSize > 0, "batchSize less than 1");
        this.batchSize = batchSize;
    }
}
