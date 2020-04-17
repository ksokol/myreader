package myreader.resource;

/**
 * @author Kamill Sokol
 */
public final class ResourceConstants {

    private ResourceConstants() {
        // prevent instantiation
    }

    private static final String API = "/api/2";
    private static final String FEEDS = API + "/feeds";

    public static final String FEED = FEEDS + "/{id}";
    public static final String FEED_FETCH_ERROR = FEED + "/fetchError";

    public static final String SUBSCRIPTIONS = API + "/subscriptions";
    public static final String SUBSCRIPTION = SUBSCRIPTIONS + "/{id}";

    public static final String SUBSCRIPTION_ENTRY = API + "/subscriptionEntries/{id}";

    public static final String SUBSCRIPTION_TAGS = API + "/subscriptionTags/{id}";

    public static final String EXCLUSIONS = API + "/exclusions";
    public static final String EXCLUSION = EXCLUSIONS + "/{id}";
    public static final String EXCLUSIONS_SUBSCRIPTION_PATTERN = EXCLUSIONS + "/{subscriptionId}/pattern/{patternId}";
    public static final String EXCLUSIONS_PATTERN = EXCLUSIONS + "/{id}/pattern";
}
