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

        final String tmp = entryLink.replace("\n", "").trim();

        if (PATTERN.matcher(tmp).matches()) {
            return tmp;
        }

        UriComponents uriComponents = UriComponentsBuilder.fromUriString(feedLink).build();
        String scheme = uriComponents.getScheme();
        String host = uriComponents.getHost();
        String baseUrl = String.format("%s://%s", scheme, host);


        String sep = StringUtils.EMPTY;

        if(!tmp.startsWith("/")) {
            sep = "/";
        }

        return String.format("%s%s%s", baseUrl, sep, tmp);
    }
}
