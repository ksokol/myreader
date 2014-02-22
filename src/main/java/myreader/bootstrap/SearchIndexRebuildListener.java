package myreader.bootstrap;

import java.io.IOException;
import java.util.ArrayList;
import java.util.concurrent.Executor;

import myreader.bootstrap.SearchIndexRebuildListener.ReindexApplicationEvent;
import myreader.entity.SubscriptionEntry;

import java.util.List;

import myreader.solr.SubscriptionEntryConverter;
import org.apache.solr.client.solrj.SolrServer;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.common.SolrInputDocument;
import org.hibernate.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

//TODO
@Component
public class SearchIndexRebuildListener implements ApplicationListener<ReindexApplicationEvent> {

    private static Logger logger = LoggerFactory.getLogger(SearchIndexRebuildListener.class.getName());
    private static final int BATCH_SIZE = 1000;

    @Autowired
    private SessionFactory sessionFactory;

    @Autowired
    private SubscriptionEntryConverter userEntrySolrUpdate;

    @Autowired
    private SolrServer solrServer;

    @Autowired
    private Executor executor;

    @Override
    public void onApplicationEvent(ReindexApplicationEvent event) {
        Runnable runnable = new Runnable() {

            @Transactional
            @Override
            public void run() {
                logger.info("rebuild index");

                emptyIndex();

                List<SolrInputDocument> docs = new ArrayList<SolrInputDocument>(BATCH_SIZE);

                //Scrollable results will avoid loading too many objects in memory
                ScrollableResults results = sessionFactory.getCurrentSession()
                        .createCriteria(SubscriptionEntry.class)
                        .setReadOnly(true)
                        .setFetchSize(BATCH_SIZE)
                        .scroll(ScrollMode.FORWARD_ONLY);

                int index = 0;
                while (results.next()) {
                    SubscriptionEntry se = (SubscriptionEntry) results.get(0);
                    docs.add(userEntrySolrUpdate.toSolrInputDocument(se));

                    if (index % BATCH_SIZE == 0) {
                        add(docs);
                        docs.clear();
                    }

                    index++;
                }

                add(docs);
                optimize();

                logger.info("rebuild index done");
            }
        };

        executor.execute(runnable);
    }

    private void emptyIndex() {
        try {
            solrServer.deleteByQuery("*:*");
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    private void add(List<SolrInputDocument> docs) {
        try {
            if(!docs.isEmpty()) {
                solrServer.add(docs);
            }
        } catch (SolrServerException e) {
            throw new RuntimeException(e.getMessage(), e);
        } catch (IOException e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    private void optimize() {
        try {
            solrServer.optimize();
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    public static class ReindexApplicationEvent extends ApplicationEvent {

        public ReindexApplicationEvent(Object source) {
            super(source);
        }

        private static final long serialVersionUID = 1L;

    }

}
