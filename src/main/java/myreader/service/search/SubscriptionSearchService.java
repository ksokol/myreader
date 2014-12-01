package myreader.service.search;

/**
 * @author Kamill Sokol
 */

import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrServer;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.response.FacetField;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

import static myreader.service.search.SolrSubscriptionFields.*;

@Deprecated
@Component
public class SubscriptionSearchService {

    @Autowired
    private SolrServer solrServer;

	@Deprecated
    public long countUnseenEntriesById(Long subscriptionId) {
        SolrQuery solrQuery = new SolrQuery();
        solrQuery.addFilterQuery(feedId(subscriptionId));
        solrQuery.setQuery(seen(false));
        solrQuery.setRows(0);

        try {
            QueryResponse query = solrServer.query(solrQuery);
            return query.getResults().getNumFound();
        } catch (SolrServerException e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

	@Deprecated
    public Map<Long, Long> countUnseenEntries() {
        return countUnseenEntriesByUser(null);
    }

	@Deprecated
    public Map<Long, Long> countUnseenEntriesByUser(String username) {
        Map<Long, Long> results = new HashMap<Long, Long>();
        SolrQuery solrQuery = new SolrQuery();

        solrQuery.setQuery(seen(false));
        solrQuery.setRows(0);
        solrQuery.setFacetLimit(Integer.MAX_VALUE);
        solrQuery.addFacetField(FEED_ID);

        if(username != null) {
            solrQuery.addFilterQuery(owner(username));
        }

        try {
            QueryResponse query = solrServer.query(solrQuery);
            for(FacetField.Count value : query.getFacetField(FEED_ID).getValues()) {
                results.put(Long.valueOf(value.getName()), value.getCount());
            }
            return results;
        } catch (SolrServerException e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

	@Deprecated
    public void delete(Long id) {
        try {
            solrServer.deleteByQuery(feedId(id));
            solrServer.commit();
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }
}
