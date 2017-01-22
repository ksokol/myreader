package myreader.fetcher.sanitizer;

import org.apache.commons.lang3.StringUtils;
import org.springframework.util.Assert;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.regex.Pattern;

/**
 * @author Kamill Sokol
 */
public final class EntryLinkSanitizer {

    private static final Pattern PATTERN = Pattern.compile("^http(s)?://.*");

    public static String sanitize(final String entryLink, final String feedLink) {
        Assert.notNull(entryLink, "entryLink is null");
        Assert.notNull(feedLink, "feedLink is null");
        Assert.isTrue(PATTERN.matcher(feedLink).matches(), "feedLink must start with http(s)?://");

        String entryUrl = entryLink.replace("\n", "").trim();

        if (PATTERN.matcher(entryUrl).matches()) {
            return entryUrl;
        }

        UriComponents uriComponents = UriComponentsBuilder.fromUriString(feedLink).build();
        String scheme = uriComponents.getScheme();

        if(isSchemeRelative(entryUrl)) {
            return String.format("%s:%s", scheme, entryUrl);
        }

        String host = uriComponents.getHost();
        String baseUrl = String.format("%s://%s", scheme, host);
        String sep = StringUtils.EMPTY;

        if(isRelative(entryUrl)) {
            sep = "/";
        }

        return String.format("%s%s%s", baseUrl, sep, entryUrl);
    }

    private static boolean isRelative(String tmp) {
        return !tmp.startsWith("/");
    }

    private static boolean isSchemeRelative(String url) {
        return url.startsWith("//");
    }
}
