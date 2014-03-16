package myreader.bootstrap;

import java.io.IOException;
import java.util.ArrayList;

import myreader.bootstrap.SearchIndexRebuildListener.ReindexApplicationEvent;
import myreader.entity.SubscriptionEntry;

import java.util.List;

import myreader.repository.SubscriptionEntryRepository;
import myreader.service.search.SubscriptionEntryConverter;
import org.apache.solr.client.solrj.SolrServer;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.common.SolrInputDocument;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

//TODO
@Component
public class SearchIndexRebuildListener implements ApplicationListener<ReindexApplicationEvent> {

    private static Logger logger = LoggerFactory.getLogger(SearchIndexRebuildListener.class.getName());
    private static final int BATCH_SIZE = 1000;

    @Autowired
    private SubscriptionEntryConverter converter;

    @Autowired
    private SubscriptionEntryRepository subscriptionEntryRepository;

    @Autowired
    private SolrServer solrServer;

    @Override
    public void onApplicationEvent(ReindexApplicationEvent event) {
        logger.info("rebuild index");

        emptyIndex();

        int pageNumber = 0;
        PageRequest pageRequest = new PageRequest(0, BATCH_SIZE);
        Page<SubscriptionEntry> page = subscriptionEntryRepository.findAll(pageRequest);

        while(page.hasNextPage()) {
            processPage(page);
            page = subscriptionEntryRepository.findAll(new PageRequest(++pageNumber, BATCH_SIZE));
        }

        processPage(page);
        optimize();
        logger.info("rebuild index done.");
    }

    private void emptyIndex() {
        try {
            solrServer.deleteByQuery("*:*");
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    private void processPage(Page<SubscriptionEntry> page) {
        List<SolrInputDocument> docs = new ArrayList<SolrInputDocument>(BATCH_SIZE);
        for(SubscriptionEntry se : page) {
            docs.add(converter.toSolrInputDocument(se));
        }
        add(docs);
        docs.clear();
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

        public ReindexApplicationEvent() {
            super(new Object());
        }

        private static final long serialVersionUID = 1L;

    }

}
