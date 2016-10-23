package myreader.config;

/**
 * @author Kamill Sokol
 */
public enum UrlMappings {

    LOGOUT("logout"),
    LOGIN_PROCESSING("check"),
    LANDING_PAGE("app"),
    HYSTRIX_STREAM("hystrix.stream"),
    HYSTRIX_PROXY("proxy.stream"),
    HYSTRIX_DASHBOARD("dashboard"),
    HYSTRIX("hystrix"),
    API("api");

    private final String mapping;

    UrlMappings(final String mapping) {
        this.mapping = "/" + mapping;
    }

    public String mapping() {
        return mapping;
    }
}
