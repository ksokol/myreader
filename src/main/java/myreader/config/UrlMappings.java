package myreader.config;

/**
 * @author Kamill Sokol
 */
public final class UrlMappings {
    private UrlMappings() {}

    public static final String JAWR_BIN = "/bin";
    public static final String JAWR_CSS = "/css";
    public static final String JAWR_JS = "/js";

    public static final String ACCOUNT_CONTEXT = "/web";
    public static final String LOGIN = ACCOUNT_CONTEXT + "/login";
    public static final String LOGOUT = ACCOUNT_CONTEXT + "/logout";
    public static final String LOGIN_PROCESSING = ACCOUNT_CONTEXT + "/check";
}
