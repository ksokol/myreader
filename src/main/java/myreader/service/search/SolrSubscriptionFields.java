package myreader.service.search;

/**
 * @author dev@sokol-web.de <Kamill Sokol>
 */
public class SolrSubscriptionFields {

    public static final String ID = "id";
    public static final String FEED_ID = "feed_id";
    public static final String TITLE = "title";
    public static final String CONTENT = "content";
    public static final String TAGS = "tags";
    public static final String SEEN = "seen";
    public static final String OWNER = "owner";
    public static final String OWNER_ID = "owner_id";

    public static String tags(String tags) {
        return format(TAGS,tags);
    }

    public static String seen(boolean seen) {
        return format(SEEN, seen);
    }

    public static String owner(String owner) {
        return format(OWNER, owner);
    }

    public static String ownerId(Long ownerId) {
        return format(OWNER_ID, Long.valueOf(ownerId));
    }

    public static String feedId(Object feedId) {
        return format(FEED_ID, String.valueOf(feedId));
    }

    private static String format(String key, Object value) {
        return String.format("%s:%s", key, value);
    }
}
