package myreader.fetcher.impl;

import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.regex.Pattern;

/**
 * @author Kamill Sokol
 */
public final class EntryLinkSanitizer {
	private EntryLinkSanitizer() {}

	private static final Pattern pattern = Pattern.compile("^http(s)?://.*");

    public static String sanitize(String entryLink, String feedLink) {
        return sanitize(entryLink, feedLink, null);
    }

	public static String sanitize(String entryLink, String feedLink, String fetchUrl) {
		if(entryLink == null || feedLink == null) {
			return "";
		}

		entryLink = entryLink.trim();

		if(pattern.matcher(entryLink).matches()) {
			return entryLink;
		}

		String baseUrl = feedLink.trim();

		if(fetchUrl != null && !pattern.matcher(feedLink).matches()) {
			UriComponents uriComponents = UriComponentsBuilder.fromUriString(fetchUrl).build();
			String scheme = uriComponents.getScheme();
			String host = uriComponents.getHost();
			baseUrl = String.format("%s://%s", scheme, host);
		}

		baseUrl = baseUrl.trim();
		String sep = (entryLink.startsWith("/") || baseUrl.startsWith("/")) ? "" : "/";

		return String.format("%s%s%s", baseUrl, sep, entryLink);
	}
}
