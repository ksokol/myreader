package myreader.fetcher.sanitizer;

import org.apache.commons.lang3.StringUtils;
import org.springframework.util.Assert;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.regex.Pattern;

/**
 * @author Kamill Sokol
 */
final class EntryLinkSanitizer {

    private static final Pattern PATTERN = Pattern.compile("^http(s)?://.*");

    public static String sanitize(String entryLink, String feedLink) {
        Assert.notNull(entryLink, "entryLink is null");
        Assert.notNull(feedLink, "feedLink is null");
        Assert.isTrue(PATTERN.matcher(feedLink).matches(), "feedLink must start with http(s)?://");

        entryLink = entryLink.trim();

        if (PATTERN.matcher(entryLink).matches()) {
            return entryLink;
        }

        UriComponents uriComponents = UriComponentsBuilder.fromUriString(feedLink).build();
        String scheme = uriComponents.getScheme();
        String host = uriComponents.getHost();
        String baseUrl = String.format("%s://%s", scheme, host);


        String sep = StringUtils.EMPTY;

        if(!entryLink.startsWith("/")) {
            sep = "/";
        }

        return String.format("%s%s%s", baseUrl, sep, entryLink);
    }
}
