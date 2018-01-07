package myreader.config;

/**
 * @author Kamill Sokol
 */
public enum UrlMappings {

    LOGOUT("logout"),
    LOGIN_PROCESSING("check"),
    LANDING_PAGE(""),
    API_2("api/2");

    private final String mapping;

    UrlMappings(final String mapping) {
        this.mapping = "/" + mapping;
    }

    public String mapping() {
        return mapping;
    }

    public String path(String path) {
        return mapping + "/" + path;
    }
}
