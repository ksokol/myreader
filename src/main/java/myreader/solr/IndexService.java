package myreader.solr;

import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import org.apache.solr.client.solrj.SolrServer;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.SolrDocument;
import org.apache.solr.common.SolrDocumentList;
import org.apache.solr.common.SolrInputDocument;
import org.apache.solr.common.params.MapSolrParams;
import org.apache.solr.common.params.MultiMapSolrParams;
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
    private EntityConverter converter;

    @Autowired
    private Executor executor;

    public void save(Object object) {
        if(object instanceof SubscriptionEntry) {
            saveSubscriptionEntry(object);
        } else if(object instanceof Subscription) {
            saveSubscription(object);
        } else {
            logger.info("could not save " + object);
        }
    }

    private void saveSubscription(Object object) {
        Subscription subscription = (Subscription) object;
        final Long userId = subscription.getUser().getId();
        final Long id = subscription.getId();
        final String title = subscription.getTitle();

        executor.execute(new Runnable() {
            @Override
            public void run() {
            try {
                Map<String, String[]> map = new HashMap<String, String[]>();

                map.put("fq", new String[] {"feed_id:" + id, "owner_id:" + userId});
                map.put("q", new String[] {"*:*"});
                map.put("rows", new String[] {String.valueOf(Integer.MAX_VALUE)});

                QueryResponse query = solrServer.query(new MultiMapSolrParams(map));
                List<SolrInputDocument> docs = new ArrayList<SolrInputDocument>();

                logger.info("processing " + query.getResults().size());

                Map<String, String>  set = new HashMap<String, String>();
                set.put("set", title);

                for(SolrDocument doc : query.getResults()) {
                    SolrInputDocument solrInputFields = new SolrInputDocument();
                    solrInputFields.addField("id", doc.get("id"));
                    solrInputFields.addField("feed_title", set);
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

    private void saveSubscriptionEntry(Object object) {
        SolrInputDocument doc = converter.toSolrInputDocument(object);

        try {
            solrServer.add(doc);
            solrServer.commit();
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

}
