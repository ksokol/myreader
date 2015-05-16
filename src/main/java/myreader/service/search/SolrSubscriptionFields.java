package myreader.service.search;

/**
 * @author Kamill Sokol
 */
@Deprecated
public class SolrSubscriptionFields {

	@Deprecated
    public static final String ID = "id";
	@Deprecated
    public static final String FEED_ID = "feed_id";
	@Deprecated
    public static final String TITLE = "title";
	@Deprecated
    public static final String CONTENT = "content";
	@Deprecated
	public static final String TAGS = "tags";
	@Deprecated
	public static final String SEEN = "seen";
	@Deprecated
	public static final String OWNER = "owner";
	@Deprecated
	public static final String OWNER_ID = "owner_id";

    @Deprecated
    public static final String FEED_TITLE = "feed_title";

    public static String tags(String tags) {
        return format(TAGS,tags);
    }

    @Deprecated
    public static String feedTitle(String feedTitle) {
        return format(FEED_TITLE,feedTitle);
    }

    public static String seen(boolean seen) {
        return format(SEEN, seen);
    }

	@Deprecated
    public static String owner(String owner) {
        return format(OWNER, owner);
    }

	@Deprecated
    public static String feedId(Object feedId) {
        return format(FEED_ID, String.valueOf(feedId));
    }

	@Deprecated
    private static String format(String key, Object value) {
        return String.format("%s:%s", key, value);
    }
}
