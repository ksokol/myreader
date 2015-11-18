package myreader.fetcher.sanitizer;

import org.apache.commons.lang3.StringUtils;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public final class StringDecoder {

	private static final Pattern PATTERN_HREF = Pattern.compile("(?:(src|href)=)+\"(/[^\"]*)");
	private static final Pattern PATTERN_PROTOCOL_RELATIVE_HREF = Pattern.compile("(?:(src|href)=)+\"(//[^\"]*)");
	private static final Pattern PATTERN_JAVASCRIPT = Pattern.compile("<[\\ ]*script.*>.*<[\\ ]*/[\\ ]*script[\\ ]*>");

	public static String eliminateJavascript(String content) {
        final Matcher matcher = PATTERN_JAVASCRIPT.matcher(content);
        return matcher.replaceAll(StringUtils.SPACE);
	}

	public static String eliminateRelativeUrls(String content, String withUrl) {
		String url;
        URL reducedUrl;

		try {
			reducedUrl = new URL(withUrl);
			String domain = reducedUrl.getHost();
			url = reducedUrl.getProtocol()+"://"+domain;
		} catch (MalformedURLException e) {
			throw new IllegalArgumentException("second parameter [" + withUrl + "] not a valid url");
		}

        String replacementProtocolRelative = "$1="+"\""+reducedUrl.getProtocol()+":$2";
        Matcher matcherProtocolRelative = PATTERN_PROTOCOL_RELATIVE_HREF.matcher(content);
        String contentWithoutProtocolRelative = matcherProtocolRelative.replaceAll(replacementProtocolRelative);

		String replacementRelative = "$1="+"\""+url+"$2";
		Matcher matcherRelative = PATTERN_HREF.matcher(contentWithoutProtocolRelative);

		return matcherRelative.replaceAll(replacementRelative);
	}

	public static String escapeHtmlContent(String unescaped, String url) {
		if(StringUtils.isNotBlank(unescaped) && StringUtils.isNotBlank(url)) {
			String escaped = eliminateJavascript(unescaped);
			return eliminateRelativeUrls(escaped,url);
		}
		return StringUtils.EMPTY;

	}

	public static String escapeSimpleHtml(String unescaped) {
		if(StringUtils.isNotBlank(unescaped)) {
			return eliminateJavascript(unescaped);
		}
		return StringUtils.EMPTY;
	}

}
