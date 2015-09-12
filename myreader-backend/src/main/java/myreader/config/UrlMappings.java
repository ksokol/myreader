package myreader.config;

/**
 * @author Kamill Sokol
 */
public enum UrlMappings {

    LOGIN("#/login"),
    LOGOUT("logout"),
    LOGIN_PROCESSING("check"),
    LANDING_PAGE("");

    private final String mapping;

    UrlMappings(final String mapping) {
        this.mapping = "/" + mapping;
    }

    public String mapping() {
        return mapping;
    }
}
