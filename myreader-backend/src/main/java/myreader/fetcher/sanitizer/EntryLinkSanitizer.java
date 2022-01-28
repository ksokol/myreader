package myreader.fetcher.sanitizer;

import org.springframework.web.util.UriComponentsBuilder;

import java.util.regex.Pattern;

public final class EntryLinkSanitizer {

  private static final Pattern PATTERN = Pattern.compile("^http(s)?://.*");

  private EntryLinkSanitizer() {
    // prevent instantiation
  }

  public static String sanitize(String entryLink, String feedLink) {
    if (entryLink == null) {
      throw new IllegalArgumentException("entryLink is null");
    }
    if (feedLink == null) {
      throw new IllegalArgumentException("feedLink is null");
    }
    if (!PATTERN.matcher(feedLink).matches()) {
      throw new IllegalArgumentException("feedLink must start with http(s)?://");
    }

    var entryUrl = entryLink.replace("\n", "").trim();

    if (PATTERN.matcher(entryUrl).matches()) {
      return entryUrl;
    }

    var uriComponents = UriComponentsBuilder.fromUriString(feedLink).build();
    var scheme = uriComponents.getScheme();

    if (isSchemeRelative(entryUrl)) {
      return String.format("%s:%s", scheme, entryUrl);
    }

    var host = uriComponents.getHost();
    var baseUrl = String.format("%s://%s", scheme, host);
    var sep = "";

    if (isRelative(entryUrl)) {
      sep = "/";
    }

    return String.format("%s%s%s", baseUrl, sep, entryUrl);
  }

  private static boolean isRelative(String url) {
    return url.charAt(0) != '/';
  }

  private static boolean isSchemeRelative(String url) {
    return url.startsWith("//");
  }
}
