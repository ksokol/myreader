package myreader.config;

/**
 * @author Kamill Sokol
 */
public enum UrlMappings {

    JAWR_BIN("bin"),
    JAWR_CSS("css"),
    JAWR_JS("js"),
    LOGIN("login"),
    LOGOUT("logout"),
    LOGIN_PROCESSING("check"),
    LANDING_PAGE("reader");

    private final String mapping;

    UrlMappings(final String mapping) {
        this.mapping = "/"+mapping;
    }

    public String mapping() {
        return mapping;
    }
}
