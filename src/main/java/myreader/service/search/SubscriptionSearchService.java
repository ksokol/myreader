package myreader.service.search;

/**
 * @author Kamill Sokol
 */

import static myreader.service.search.SolrSubscriptionFields.feedId;

import org.apache.solr.client.solrj.SolrServer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Deprecated
@Component
public class SubscriptionSearchService {

    @Autowired
    private SolrServer solrServer;

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
