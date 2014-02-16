package myreader.solr;

import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

import java.util.Date;

/**
 * @author dev@sokol-web.de <Kamill Sokol>
 */
public class SolrSubscriptionFields {

    private static DateTimeFormatter fmt = DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mm:ss.sss'Z'").withZoneUTC();

    public static final String ID = "id";
    public static final String FEED_ID = "feed_id";
    public static final String FEED_TAG = "feed_tag";
    public static final String FEED_TITLE = "feed_title";
    public static final String FEED_URL = "feed_url";
    public static final String FEED_ICON = "feed_icon";
    public static final String FEED_ICON_MIME = "feed_icon_mime";
    public static final String TITLE = "title";
    public static final String CONTENT = "content";
    public static final String URL = "url";
    public static final String TAGS = "tags";
    public static final String SEEN = "seen";
    public static final String OWNER = "owner";
    public static final String OWNER_ID = "owner_id";
    public static final String CREATED_AT = "created_at";
    public static final String GUID = "guid";

    public static String feedTag(String tag) {
        return String.format("%s:%s", FEED_TAG,tag);
    }

    public static String feedTitle(String title) {
        return String.format("%s:%s", FEED_TITLE,title);
    }

    public static String tags(String tags) {
        return String.format("%s:%s", TAGS,tags);
    }

    public static String seen(boolean seen) {
        return String.format("%s:%s", SEEN, seen);
    }

    public static String owner(String owner) {
        return String.format("%s:%s", OWNER, owner);
    }

    public static String ownerId(Long ownerId) {
        return String.format("%s:%s", OWNER_ID, Long.valueOf(ownerId));
    }

    public static String createdAt(Date createdAt) {
        return String.format("%s:%s", CREATED_AT, new DateTime(createdAt).toString(fmt));
    }

    public static String feedId(Long feedId) {
        return String.format("%s:%s", FEED_ID, String.valueOf(feedId));
    }
}
