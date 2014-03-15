package myreader.service.search;

import myreader.entity.*;
import myreader.service.subscriptionentry.SubscriptionEntrySearchQuery;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrServer;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.SolrDocument;
import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import static myreader.service.search.SolrSubscriptionFields.*;
import static myreader.service.search.FieldHelper.*;

import java.util.*;

/**
 * @author dev@sokol-web.de <Kamill Sokol>
 */
@Component
public class SubscriptionEntrySearchService {

    @Autowired
    private SolrServer solrServer;

    @Autowired
    private SubscriptionEntryConverter converter;

    public List<SubscriptionEntry> findByQueryAndUser(SubscriptionEntrySearchQuery myQuery, String username) {
        List<SubscriptionEntry> results = new ArrayList<SubscriptionEntry>();
        SolrQuery query = new SolrQuery();

        for (String k : myQuery.getFilter().keySet()) {
            String s = myQuery.getFilter().get(k);

            if("subscription.tag".equals(k)) {
                query.addFilterQuery(or(feedTag(phrase(s)), feedTitle(phrase(s))));
            } else if("tag".equals(k)) {
                query.addFilterQuery(tags(s));
            }
        }

        if (!myQuery.isShowAll()) {
            query.addFilterQuery(seen(false));
        }

        if(username != null) {
            query.addFilterQuery(owner(username));
        }

        if (myQuery.getOffset() != null) {
            DateTime offset = new DateTime(myQuery.getOffset()).minusMillis(1);
            query.addFilterQuery(range().on(CREATED_AT).from(wildcard()).to(offset));

            if ("createdAt".equals(myQuery.getOrderBy())) {
                if ("asc".equals(myQuery.getSortMode())) {
                    query.setSort(CREATED_AT, SolrQuery.ORDER.asc);
                }
            }
        }

        if (myQuery.getQ() != null) {
            query.setQuery(myQuery.getQ());
        }

        query.setRows(myQuery.getRows());

        try {
            QueryResponse query2 = solrServer.query(query);
            for (SolrDocument doc : query2.getResults()) {
                SubscriptionEntry subscriptionEntry = converter.fromSolrDocument(doc);
                results.add(subscriptionEntry);
            }
            return results;
        } catch (SolrServerException e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }
}
