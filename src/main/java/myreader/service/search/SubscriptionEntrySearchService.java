package myreader.service.search;

import java.util.ArrayList;
import java.util.List;

import org.apache.solr.client.solrj.SolrServer;
import org.apache.solr.common.SolrInputDocument;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import myreader.entity.SubscriptionEntry;

/**
 * @author Kamill Sokol
 */
@Deprecated
@Component
public class SubscriptionEntrySearchService {

    @Autowired
    private SolrServer solrServer;

    @Autowired
    private SubscriptionEntryToSolrInputDocumentConverter converter;

	@Deprecated
    public void save(SubscriptionEntry subscriptionEntry) {
        SolrInputDocument doc = converter.convert(subscriptionEntry);

        try {
            solrServer.add(doc);
            solrServer.commit();
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

	@Deprecated
    public void save(List<SubscriptionEntry> subscriptionEntries) {
        if(subscriptionEntries == null || subscriptionEntries.isEmpty()) {
            return;
        }

        List<SolrInputDocument> docs = new ArrayList<SolrInputDocument>();

        for (SubscriptionEntry subscriptionEntry : subscriptionEntries) {
            docs.add(converter.convert(subscriptionEntry));
        }

        try {
            solrServer.add(docs);
            solrServer.commit();
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }
}
