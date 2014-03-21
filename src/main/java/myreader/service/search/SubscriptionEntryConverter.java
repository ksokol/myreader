package myreader.service.search;

import myreader.entity.*;
import org.apache.solr.common.SolrInputDocument;
import org.springframework.stereotype.Component;

import static myreader.service.search.SolrSubscriptionFields.*;

/**
 * @author dev@sokol-web.de <Kamill Sokol>
 */
@Component
public class SubscriptionEntryConverter {

    public SolrInputDocument toSolrInputDocument(SubscriptionEntry userEntry) {
        SolrInputDocument input = new SolrInputDocument();

        input.addField(ID, userEntry.getId());
        input.addField(OWNER, userEntry.getSubscription().getUser().getEmail());
        input.addField(OWNER_ID, userEntry.getSubscription().getUser().getId());
        input.addField(FEED_ID, userEntry.getSubscription().getId());
        input.addField(TITLE, userEntry.getFeedEntry().getTitle());
        input.addField(CONTENT, userEntry.getFeedEntry().getContent());
        input.addField(SEEN, userEntry.isSeen());
        input.addField(TAGS, userEntry.getTag());

        return input;
    }

}
