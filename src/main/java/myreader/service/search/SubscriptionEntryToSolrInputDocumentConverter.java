package myreader.service.search;

import static myreader.service.search.SolrSubscriptionFields.CONTENT;
import static myreader.service.search.SolrSubscriptionFields.FEED_ID;
import static myreader.service.search.SolrSubscriptionFields.ID;
import static myreader.service.search.SolrSubscriptionFields.OWNER;
import static myreader.service.search.SolrSubscriptionFields.OWNER_ID;
import static myreader.service.search.SolrSubscriptionFields.SEEN;
import static myreader.service.search.SolrSubscriptionFields.TAGS;
import static myreader.service.search.SolrSubscriptionFields.TITLE;

import org.apache.solr.common.SolrInputDocument;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import myreader.entity.SubscriptionEntry;

/**
 * @author Kamill Sokol
 */
@Deprecated
@Component
public class SubscriptionEntryToSolrInputDocumentConverter implements Converter<SubscriptionEntry, SolrInputDocument> {

	@Deprecated
	@Override
    public SolrInputDocument convert(SubscriptionEntry userEntry) {
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
