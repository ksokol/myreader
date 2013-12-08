package myreader.bootstrap;

import java.util.concurrent.Executor;

import myreader.bootstrap.SearchIndexCheck.ReindexApplicationEvent;
import myreader.entity.SubscriptionEntry;

import org.hibernate.CacheMode;
import org.hibernate.FlushMode;
import org.hibernate.ScrollMode;
import org.hibernate.ScrollableResults;
import org.hibernate.SessionFactory;
import org.hibernate.search.FullTextSession;
import org.hibernate.search.Search;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

//TODO
@Component
public class SearchIndexCheck implements ApplicationListener<ReindexApplicationEvent> {

    Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    private SessionFactory sessionFactory;

    @Autowired
    private Executor executor;

    @Override
    public void onApplicationEvent(ReindexApplicationEvent event) {
        Runnable runnable = new Runnable() {

            private final SessionFactory sf = SearchIndexCheck.this.sessionFactory;

            @Transactional
            @Override
            public void run() {
                logger.info("rebuild index");

                FullTextSession fullTextSession = Search.getFullTextSession(this.sf.getCurrentSession());

                int BATCH_SIZE = 1000;

                fullTextSession.setFlushMode(FlushMode.MANUAL);
                fullTextSession.setCacheMode(CacheMode.IGNORE);

                //Scrollable results will avoid loading too many objects in memory
                ScrollableResults results = fullTextSession.createCriteria(SubscriptionEntry.class).setFetchSize(BATCH_SIZE).scroll(ScrollMode.FORWARD_ONLY);
                int index = 0;
                while (results.next()) {
                    index++;
                    fullTextSession.index(results.get(0)); //index each element
                    if (index % BATCH_SIZE == 0) {
                        System.out.println("flushin: " + index);
                        fullTextSession.flushToIndexes(); //apply changes to indexes
                        fullTextSession.clear(); //free memory since the queue is processed
                    }
                }

                logger.info("done");
            }
        };

        executor.execute(runnable);
    }

    public static class ReindexApplicationEvent extends ApplicationEvent {

        public ReindexApplicationEvent(Object source) {
            super(source);
        }

        private static final long serialVersionUID = 1L;

    }

}
