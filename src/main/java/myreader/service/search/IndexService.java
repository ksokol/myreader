package myreader.service.search;

import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.resource.SolrController;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrServer;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.SolrDocument;
import org.apache.solr.common.SolrInputDocument;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.Executor;
import java.util.logging.Logger;

/**
 * @author dev@sokol-web.de <Kamill Sokol>
 */
@Component
public class IndexService {

    private final Logger logger = Logger.getLogger(SolrController.class.getName());

    @Autowired
    private SolrServer solrServer;

    @Autowired
    private SubscriptionEntryConverter converter;

    @Autowired
    private Executor executor;

    public void save(Object object) {
        if(object instanceof SubscriptionEntry) {
            saveSubscriptionEntry((SubscriptionEntry) object);
        } else if(object instanceof Subscription) {
            saveSubscription(object);
        } else {
            logger.info("could not save " + object);
        }
    }

    public void deleteSubscription(Long id) {
        try {
            solrServer.deleteByQuery(SolrSubscriptionFields.feedId(id));
            solrServer.commit();
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    private void saveSubscription(Object object) {
        Subscription subscription = (Subscription) object;
        final Long userId = subscription.getUser().getId();
        final Long feedId = subscription.getId();
        final String title = subscription.getTitle();

        executor.execute(new Runnable() {
            @Override
            public void run() {
            try {
                SolrQuery solrQuery = new SolrQuery();
                solrQuery.addFilterQuery(SolrSubscriptionFields.feedId(feedId), SolrSubscriptionFields.ownerId(userId));
                solrQuery.setRows(Integer.MAX_VALUE);

                QueryResponse query = solrServer.query(solrQuery);
                List<SolrInputDocument> docs = new ArrayList<SolrInputDocument>();

                logger.info("processing " + query.getResults().size());

                Map<String, String>  set = new HashMap<String, String>();
                set.put("set", title);

                for(SolrDocument doc : query.getResults()) {
                    SolrInputDocument solrInputFields = new SolrInputDocument();
                    solrInputFields.addField(SolrSubscriptionFields.ID, doc.get(SolrSubscriptionFields.ID));
                    solrInputFields.addField(SolrSubscriptionFields.FEED_TITLE, set);
                    docs.add(solrInputFields);
                }

                if(!docs.isEmpty()) {
                    solrServer.add(docs);
                    solrServer.commit();
                }
            } catch (Exception e) {
                throw new RuntimeException(e.getMessage(), e);
            }
            }
        });
    }

    private void saveSubscriptionEntry(SubscriptionEntry subscriptionEntry) {
        SolrInputDocument doc = converter.toSolrInputDocument(subscriptionEntry);

        try {
            solrServer.add(doc);
            solrServer.commit();
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

}
