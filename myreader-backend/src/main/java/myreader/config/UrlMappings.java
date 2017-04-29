package myreader.config;

/**
 * @author Kamill Sokol
 */
public enum UrlMappings {

    LOGOUT("logout"),
    LOGIN_PROCESSING("check"),
    LANDING_PAGE(""),
    API("api");

    private final String mapping;

    UrlMappings(final String mapping) {
        this.mapping = "/" + mapping;
    }

    public String mapping() {
        return mapping;
    }
}
