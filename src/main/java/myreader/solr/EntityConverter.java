package myreader.solr;

import myreader.entity.SubscriptionEntry;
import org.apache.solr.client.solrj.SolrServer;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.common.SolrInputDocument;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * @author dev@sokol-web.de <Kamill Sokol>
 */

//TODO
@Component
public class EntityConverter {

    public SolrInputDocument toSolrInputDocument(Object object) {
        //TODO
        SubscriptionEntry userEntry = (SubscriptionEntry) object;
        SolrInputDocument input = new SolrInputDocument();

        input.addField("id", userEntry.getId());
        input.addField("owner", userEntry.getSubscription().getUser().getEmail());
        input.addField("owner_id", userEntry.getSubscription().getUser().getId());
        input.addField("feed_title", userEntry.getSubscription().getTitle());
        input.addField("feed_id", userEntry.getSubscription().getId());
        input.addField("feed_url", userEntry.getSubscription().getUrl());
        input.addField("entry_title", userEntry.getFeedEntry().getTitle());
        input.addField("entry_content", userEntry.getFeedEntry().getContent());
        input.addField("entry_createdAt", userEntry.getCreatedAt());
        input.addField("entry_seen", userEntry.isSeen());

        String tag = userEntry.getTag();

        if(tag != null) {
            for (String s : tag.split(",")) {
                input.addField("entry_tags", s);
            }
        }

        return input;
    }
}
