package myreader.solr;

import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

import java.io.UnsupportedEncodingException;
import java.util.Date;

import static java.net.URLEncoder.encode;

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
        return format(FEED_TAG,tag);
    }

    public static String feedTitle(String title) {
        return format(FEED_TITLE,title);
    }

    public static String tags(String tags) {
        return format(TAGS,tags);
    }

    public static String seen(boolean seen) {
        return format(SEEN, seen);
    }

    public static String owner(String owner) {
        return String.format(FMT, OWNER, owner);
    }

    public static String ownerId(Long ownerId) {
        return format(OWNER_ID, Long.valueOf(ownerId));
    }

    public static String createdAt(Date createdAt) {
        return format(CREATED_AT, new DateTime(createdAt).toString(fmt));
    }

    public static String feedId(Long feedId) {
        return format(FEED_ID, String.valueOf(feedId));
    }

    private static final String FMT = "%s:%s";

    private static String format(String key, Object value) {
        try {
            String encoded = encode(String.valueOf(value), "UTF8");
            return String.format(FMT, key, encoded);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }
}
