package myreader.resource;

/**
 * @author Kamill Sokol
 */
public final class ResourceConstants {

    private static final String API = "/api/2";

    private static final String FEEDS_URL = API + "/feeds";
    public static final String FEED_URL = FEEDS_URL + "/{id}";
    public static final String FEED_FETCH_ERROR_URL = FEED_URL + "/fetchError";
}
