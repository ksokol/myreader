package myreader.service.search.jobs;

import myreader.entity.SubscriptionEntry;
import myreader.repository.SubscriptionEntryRepository;
import myreader.service.search.SubscriptionEntryConverter;
import org.apache.solr.client.solrj.SolrServer;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.common.SolrInputDocument;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * TODO IndexSyncJob and SyndFetcherJob should be running exclusively. this prevents duplicate entries in index
 * @author Kamill Sokol dev@sokol-web.de
 */
public class IndexSyncJob implements Runnable, ApplicationListener<ContextClosedEvent> {
    private static final Logger log = LoggerFactory.getLogger(IndexSyncJob.class);

    private static final int BATCH_SIZE = 1000;
    private final SubscriptionEntryConverter converter;
    private final SubscriptionEntryRepository subscriptionEntryRepository;
    private final SolrServer solrServer;
    private volatile boolean alive = true;

    public IndexSyncJob(SubscriptionEntryConverter converter, SubscriptionEntryRepository subscriptionEntryRepository, SolrServer solrServer) {
        this.converter = converter;
        this.subscriptionEntryRepository = subscriptionEntryRepository;
        this.solrServer = solrServer;
    }

    @Override
    public void run() {
        log.info("start");

        try {
            emptyIndex();

            int pageNumber = 0;
            PageRequest pageRequest = new PageRequest(0, BATCH_SIZE);
            Page<SubscriptionEntry> page = subscriptionEntryRepository.findAll(pageRequest);

            while(page.hasNextPage() && alive) {
                processPage(page);
                page = subscriptionEntryRepository.findAll(new PageRequest(++pageNumber, BATCH_SIZE));
            }

            processPage(page);
            optimize();
        } catch (Exception e) {
            log.error("error during index sync", e);
        }

        if(alive) {
            log.info("search index sync done");
        } else {
            log.info("got stop signal. aborting search index sync");
        }

        log.info("end");
    }

    private void emptyIndex() throws IOException, SolrServerException {
        solrServer.deleteByQuery("*:*");
    }

    private void processPage(Page<SubscriptionEntry> page) throws IOException, SolrServerException {
        List<SolrInputDocument> docs = new ArrayList<SolrInputDocument>(BATCH_SIZE);
        for(SubscriptionEntry se : page) {
            docs.add(converter.toSolrInputDocument(se));
        }
        add(docs);
        docs.clear();
    }

    private void add(List<SolrInputDocument> docs) throws IOException, SolrServerException {
        if(!docs.isEmpty()) {
            solrServer.add(docs);
        }
    }

    private void optimize() throws IOException, SolrServerException {
        solrServer.optimize();
    }

    @Override
    public void onApplicationEvent(ContextClosedEvent event) {
        log.info("got stop signal");
        alive = false;
    }
}
