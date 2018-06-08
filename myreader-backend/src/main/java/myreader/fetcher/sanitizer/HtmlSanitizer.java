package myreader.fetcher.sanitizer;

import org.apache.commons.lang3.StringEscapeUtils;
import org.owasp.html.HtmlPolicyBuilder;
import org.owasp.html.PolicyFactory;
import org.owasp.html.Sanitizers;

import java.util.regex.Pattern;

/**
 * @author Kamill Sokol
 */
public final class HtmlSanitizer {

    private static final Pattern PROTOCOL = Pattern.compile("^http(s)?://.*", Pattern.DOTALL);
    private static final PolicyFactory TITLE_POLICY = initializeTitlePolicyFactory();
    private static final PolicyFactory CONTENT_POLICY = initializeContentPolicyFactory();

    private HtmlSanitizer() { /* prevent initialization */}

    public static String sanitizeTitle(String value) {
        return trim(StringEscapeUtils.unescapeHtml4(TITLE_POLICY.sanitize(value)));
    }

    public static String sanitizeContent(String value) {
        return trim(CONTENT_POLICY.sanitize(value));
    }

    private static String trim(String value) {
        return value.trim().replaceAll("\\s+", " ");
    }

    private static PolicyFactory initializeTitlePolicyFactory() {
        return new HtmlPolicyBuilder().toFactory();
    }

    private static PolicyFactory initializeContentPolicyFactory() {
        return Sanitizers.FORMATTING
                .and(Sanitizers.BLOCKS)
                .and(Sanitizers.STYLES)
                .and(Sanitizers.TABLES)
                .and(new HtmlPolicyBuilder()
                        .allowAttributes("src")
                        .matching(PROTOCOL)
                        .onElements("img")

                        .allowAttributes("alt")
                        .onElements("img")

                        .allowAttributes("href")
                        .matching(PROTOCOL)
                        .onElements("a")
                        .allowElements((elementName, attributes) -> {
                            if (attributes.contains("href")) {
                                attributes.add("target");
                                attributes.add("_blank");
                            }
                            return elementName;
                        }, "a")
                        .requireRelsOnLinks("noopener", "noreferrer")

                        .allowStandardUrlProtocols()
                        .allowElements("img", "pre", "code", "figure")
                        .toFactory()
                );
    }
}