package myreader.fetcher.impl;

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

    public static String sanitize(String entryLink, String feedLink, String fetchUrl) {
        Assert.notNull(fetchUrl, "fetchUrl is null");
        if (StringUtils.isBlank(entryLink) || StringUtils.isBlank(feedLink)) {
            return StringUtils.EMPTY;
        }

        entryLink = entryLink.trim();

        if (PATTERN.matcher(entryLink).matches()) {
            return entryLink;
        }

        String baseUrl = feedLink.trim();

        if (!PATTERN.matcher(feedLink).matches()){
            UriComponents uriComponents = UriComponentsBuilder.fromUriString(fetchUrl).build();
            String scheme = uriComponents.getScheme();
            String host = uriComponents.getHost();
            baseUrl = String.format("%s://%s", scheme, host);
        }

        String sep = StringUtils.EMPTY;

        if(!entryLink.startsWith("/")) {
            sep = "/";
        }

        return String.format("%s%s%s", baseUrl, sep, entryLink);
    }
}
