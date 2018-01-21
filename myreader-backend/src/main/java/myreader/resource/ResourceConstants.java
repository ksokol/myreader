package myreader.resource;

import org.springframework.hateoas.Link;
import org.springframework.hateoas.UriTemplate;

/**
 * @author Kamill Sokol
 */
public final class ResourceConstants {

    private static final String API = "/api/2";

    private static final String FEEDS_URL = API + "/feeds";
    public static final String FEED_URL = FEEDS_URL + "/{id}";
    public static final String FEED_FETCH_ERROR_URL = FEED_URL + "/fetchError";
    private static UriTemplate FEED_FETCH_ERROR_URL_TEMPLATE = new UriTemplate(FEED_FETCH_ERROR_URL);

    public static Link fetchErrorsLink(Long id) {
        return new Link(FEED_FETCH_ERROR_URL_TEMPLATE, "fetchErrors").expand(id);
    }
}
