package myreader.solr;

/**
 * @author dev@sokol-web.de <Kamill Sokol>
 */

import org.apache.solr.client.solrj.SolrServer;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.response.FacetField;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.SolrDocument;
import org.apache.solr.common.SolrInputDocument;
import org.apache.solr.common.params.MapSolrParams;
import org.apache.solr.common.params.MultiMapSolrParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class SearchService {

    @Autowired
    private SolrServer solrServer;

    public long countUnseenSubscriptionEntries(Long subscriptionId) {
        Map<String, String> map = new HashMap<String, String>();

        map.put("fq", "feed_id:" + subscriptionId);
        map.put("q", "entry_seen:false");
        map.put("rows", "0");

        try {
            QueryResponse query = solrServer.query(new MapSolrParams(map));
            return query.getResults().getNumFound();
        } catch (SolrServerException e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    public Map<Long, Long> countUnseenSubscriptionEntries(String username) {
        Map<String, String> map = new HashMap<String, String>();
        Map<Long, Long> results = new HashMap<Long, Long>();

        map.put("q", "entry_seen:false");
        map.put("rows", "0");
        map.put("fq", "owner:"+username);
        map.put("facet.field", "feed_id");
        map.put("facet.limit", String.valueOf(Integer.MAX_VALUE));

        try {
            QueryResponse query = solrServer.query(new MapSolrParams(map));

            for(FacetField.Count value : query.getFacetField("feed_id").getValues()) {
                results.put(Long.valueOf(value.getName()), value.getCount());
            }

            return results;
        } catch (SolrServerException e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }
}
