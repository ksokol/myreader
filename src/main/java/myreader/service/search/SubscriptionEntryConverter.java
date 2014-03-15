package myreader.service.search;

import myreader.entity.*;
import org.apache.solr.common.SolrDocument;
import org.apache.solr.common.SolrInputDocument;
import org.springframework.stereotype.Component;

import static myreader.service.search.SolrSubscriptionFields.*;

import java.util.Date;

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
        input.addField(FEED_TITLE, userEntry.getSubscription().getTitle());
        input.addField(FEED_ID, userEntry.getSubscription().getId());
        input.addField(FEED_URL, userEntry.getSubscription().getFeed().getUrl());
        input.addField(FEED_TAG, userEntry.getSubscription().getTag());
        input.addField(TITLE, userEntry.getFeedEntry().getTitle());
        input.addField(CONTENT, userEntry.getFeedEntry().getContent());
        input.addField(URL, userEntry.getFeedEntry().getUrl());
        input.addField(CREATED_AT, userEntry.getCreatedAt());
        input.addField(SEEN, userEntry.isSeen());
        input.addField(GUID, userEntry.getFeedEntry().getGuid());
        input.addField(TAGS, userEntry.getTag());

        if(userEntry.getSubscription().getFeed().getIcon() != null) {
            input.addField(FEED_ICON, userEntry.getSubscription().getFeed().getIcon().getIcon());
            input.addField(FEED_ICON_MIME, userEntry.getSubscription().getFeed().getIcon().getMimeType());
        }

        return input;
    }

    public SubscriptionEntry fromSolrDocument(SolrDocument doc) {
        SubscriptionEntry se = new SubscriptionEntry();

        se.setCreatedAt((Date) doc.getFieldValue(CREATED_AT));
        se.setId(Long.valueOf((String) doc.getFieldValue(ID)));
        se.setSeen(Boolean.valueOf((Boolean) doc.getFieldValue(SEEN)));

        FeedEntry feedEntry = new FeedEntry();
        feedEntry.setContent((String) doc.getFieldValue(CONTENT));
        feedEntry.setUrl((String) doc.getFieldValue(URL));
        feedEntry.setTitle((String) doc.getFieldValue(TITLE));

        se.setFeedEntry(feedEntry);

        Subscription subscription = new Subscription();
        subscription.setTitle((String) doc.getFieldValue(FEED_TITLE));

        Feed feed = new Feed();
        FeedIcon feedIcon = new FeedIcon();

        feedIcon.setIcon((String) doc.getFieldValue(FEED_ICON));
        feedIcon.setMimeType((String) doc.getFieldValue(FEED_ICON_MIME));
        feed.setIcon(feedIcon);

        subscription.setFeed(feed);

        se.setSubscription(subscription);
        se.setTag((String) doc.getFieldValue(TAGS));

        return se;
    }
}
