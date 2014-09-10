package myreader.service.search;

import myreader.entity.SubscriptionEntry;
import myreader.service.subscriptionentry.SubscriptionEntrySearchQuery;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrServer;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.SolrDocument;
import org.apache.solr.common.SolrInputDocument;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import static myreader.service.search.SolrSubscriptionFields.*;
import static myreader.service.search.FieldHelper.*;

import java.util.*;

/**
 * @author Kamill Sokol
 */
@Component
public class SubscriptionEntrySearchService {

    @Autowired
    private SolrServer solrServer;

    @Autowired
    private SubscriptionEntryConverter converter;

    public List<Long> findByQueryAndUser(SubscriptionEntrySearchQuery myQuery, String username) {
        List<Long> results = new ArrayList<Long>();
        SolrQuery query = new SolrQuery();

        if(myQuery.getTag() != null) {
            query.addFilterQuery(tags(myQuery.getTag()));
        }

        if(myQuery.getFeedId() != null) {
            query.addFilterQuery(feedId(or(myQuery.getFeedId())));
        }

        if(myQuery.getFeedTitle() != null) {
            query.addFilterQuery(feedTitle(phrase(myQuery.getFeedTitle())));
        }

        if (!myQuery.isShowAll()) {
            query.addFilterQuery(seen(false));
        }

        if(username != null) {
            query.addFilterQuery(owner(username));
        }

        if(myQuery.getLastId() != null) {
            query.addFilterQuery(range().on(ID).from(wildcard()).to(myQuery.getLastId() -1));
        }

        if (myQuery.getQ() != null) {
            query.setQuery(myQuery.getQ());
        }

        query.setRows(myQuery.getRows());

        try {
            QueryResponse query2 = solrServer.query(query);
            for (SolrDocument doc : query2.getResults()) {
                Long id = (Long) doc.getFieldValue(ID);
                results.add(id);
            }
            return results;
        } catch (SolrServerException e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    public void save(SubscriptionEntry subscriptionEntry) {
        SolrInputDocument doc = converter.toSolrInputDocument(subscriptionEntry);

        try {
            solrServer.add(doc);
            solrServer.commit();
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    public void save(List<SubscriptionEntry> subscriptionEntries) {
        if(subscriptionEntries == null || subscriptionEntries.isEmpty()) {
            return;
        }

        List<SolrInputDocument> docs = new ArrayList<SolrInputDocument>();

        for (SubscriptionEntry subscriptionEntry : subscriptionEntries) {
            docs.add(converter.toSolrInputDocument(subscriptionEntry));
        }

        try {
            solrServer.add(docs);
            solrServer.commit();
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }
}
