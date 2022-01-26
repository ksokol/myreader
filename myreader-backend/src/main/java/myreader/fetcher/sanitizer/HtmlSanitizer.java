package myreader.fetcher.sanitizer;

import org.apache.commons.text.StringEscapeUtils;
import org.owasp.html.CssSchema;
import org.owasp.html.HtmlPolicyBuilder;
import org.owasp.html.HtmlStreamEventReceiverWrapper;
import org.owasp.html.PolicyFactory;
import org.owasp.html.Sanitizers;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;

public final class HtmlSanitizer {

  private static final List<String> DISALLOWED_STYLE_ATTRIBUTES = Arrays.asList("width", "height");
  private static final Pattern HTTP_PROTOCOLS = Pattern.compile("^http(s)?://.*", Pattern.DOTALL);
  private static final Pattern SECURE_HTTP_PROTOCOL = Pattern.compile("^https://.*", Pattern.DOTALL);
  private static final PolicyFactory TITLE_POLICY = initializeTitlePolicyFactory();
  private static final PolicyFactory CONTENT_POLICY = initializeContentPolicyFactory(false);
  private static final PolicyFactory STRIP_IMAGES_POLICY = initializeContentPolicyFactory(true);

  private HtmlSanitizer() {/* prevent initialization */}

  public static String sanitizeTitle(String value) {
    return trim(StringEscapeUtils.unescapeHtml4(TITLE_POLICY.sanitize(value)));
  }

  public static String sanitizeContent(String value, boolean stripImages) {
    var sanitized = CONTENT_POLICY.sanitize(value);
    return stripImages ? STRIP_IMAGES_POLICY.sanitize(sanitized) : sanitized;
  }

  private static String trim(String value) {
    return value.trim().replaceAll("\\s+", " ");
  }

  private static PolicyFactory initializeTitlePolicyFactory() {
    return new HtmlPolicyBuilder().toFactory();
  }

  private static PolicyFactory initializeContentPolicyFactory(boolean stripImages) {
    var htmlPolicyBuilder = new HtmlPolicyBuilder()
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
      .allowElements("img", "pre", "code", "figure");

    if (stripImages) {
      htmlPolicyBuilder
        .disallowElements("img");
    } else {
      htmlPolicyBuilder
        .allowAttributes("src")
        .matching(SECURE_HTTP_PROTOCOL)
        .onElements("img")

        .allowAttributes("alt")
        .onElements("img")
        .withPostprocessor(sink -> new HtmlStreamEventReceiverWrapper(sink) {
          @Override
          public void openTag(String elementName, List<String> attrs) {
            if ("img".equalsIgnoreCase(elementName)) {
              attrs.add("loading");
              attrs.add("lazy");
            }
            super.openTag(elementName, attrs);
          }
        });
    }

    return Sanitizers.FORMATTING
      .and(Sanitizers.BLOCKS)
      .and(allowedStyles())
      .and(Sanitizers.TABLES)
      .and(htmlPolicyBuilder.toFactory());
  }

  private static PolicyFactory allowedStyles() {
    Set<String> allowedCssProperties = new HashSet<>(CssSchema.DEFAULT.allowedProperties());
    DISALLOWED_STYLE_ATTRIBUTES.forEach(allowedCssProperties::remove);
    return new HtmlPolicyBuilder().allowStyling(CssSchema.withProperties(allowedCssProperties)).toFactory();
  }
}
