package myreader.fetcher.sanitizer;

import org.apache.commons.text.StringEscapeUtils;
import org.owasp.html.CssSchema;
import org.owasp.html.HtmlPolicyBuilder;
import org.owasp.html.PolicyFactory;
import org.owasp.html.Sanitizers;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;

/**
 * @author Kamill Sokol
 */
public final class HtmlSanitizer {

    private static final List<String> DISALLOWED_STYLE_ATTRIBUTES = Arrays.asList("width", "height");
    private static final Pattern HTTP_PROTOCOLS = Pattern.compile("^http(s)?://.*", Pattern.DOTALL);
    private static final Pattern SECURE_HTTP_PROTOCOL = Pattern.compile("^https://.*", Pattern.DOTALL);
    private static final PolicyFactory TITLE_POLICY = initializeTitlePolicyFactory();
    private static final PolicyFactory CONTENT_POLICY = initializeContentPolicyFactory();

    private HtmlSanitizer() {/* prevent initialization */}

    public static String sanitizeTitle(String value) {
        return trim(StringEscapeUtils.unescapeHtml4(TITLE_POLICY.sanitize(value)));
    }

    public static String sanitizeContent(String value) {
        return CONTENT_POLICY.sanitize(value);
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
                .and(allowedStyles())
                .and(Sanitizers.TABLES)
                .and(new HtmlPolicyBuilder()
                        .allowAttributes("src")
                        .matching(SECURE_HTTP_PROTOCOL)
                        .onElements("img")

                        .allowAttributes("alt")
                        .onElements("img")

                        .allowAttributes("href")
                        .matching(HTTP_PROTOCOLS)
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

    private static PolicyFactory allowedStyles() {
        Set<String> allowedCssProperties = new HashSet<>(CssSchema.DEFAULT.allowedProperties());
        allowedCssProperties.removeAll(DISALLOWED_STYLE_ATTRIBUTES);
        return new HtmlPolicyBuilder().allowStyling(CssSchema.withProperties(allowedCssProperties)).toFactory();
    }
}
