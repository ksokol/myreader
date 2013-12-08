package myreader.fetcher.impl;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class StringDecoder {
	private static Pattern pattern = Pattern.compile("(?:(src|href)=)+\"(/[^\"]*)");

	//	public static String unescapeHTML(String escaped) {
	//		return StringEscapeUtils.unescapeHtml(StringUtils.normalizeSpace(escaped)); //.replaceAll("\\p{Space}"," "));
	//	}

	public static String eliminateCssStyle(String content) {
		return content; //content.replaceAll("(float|clear)+:[\\ ]*(both|left)+;", "");
	}

	public static String eliminateJavascript(String content) {
		return content.replaceAll("<[\\ ]*script.*>.*<[\\ ]*/[\\ ]*script[\\ ]*>", " ");
	}

	public static String eliminateRelativeUrls(String content, String withUrl) {
		String url = null;

		try {
			URL reducedUrl = new URL(withUrl);
			String domain = reducedUrl.getHost();
			url = reducedUrl.getProtocol()+"://"+domain;
		} catch (MalformedURLException e) {
			throw new RuntimeException(e);
		}

		String replaceStr = "$1="+"\""+url+"$2";
		Matcher matcher = pattern.matcher(content);

		return matcher.replaceAll(replaceStr);
	}

	public static String eliminateWhitespace(String content) {
		return content; //StringUtils.replaceEach(content, new String[] {"\r\n","\n"}, new String[] {" "," "});
	}

	public static String escapeForJson(String content) {
		return content; //StringUtils.replaceEach(content, new String[] {"\\"}, new String[] {"\\\\"});
	}

	public static String escapeHtml(String content) {
		return content; //StringEscapeUtils.escapeHtml(content);
	}

	public static String escapeHtmlContent(String unescaped, String url) {
		if(unescaped != null && url != null) {
			String escaped = eliminateCssStyle(unescaped);
			escaped = eliminateJavascript(escaped);
			escaped = eliminateRelativeUrls(escaped,url);
			escaped = eliminateWhitespace(escaped);
			escaped = escapeForJson(escaped);
			escaped = normalize(escaped);
			escaped = escapeHtml(escaped);

			return escaped;
		} else {
			return "";
		}
	}

	public static String escapeSimpleHtml(String unescaped) {
		if(unescaped != null) {
			String escaped = eliminateCssStyle(unescaped);
			escaped = eliminateJavascript(escaped);
			escaped = eliminateWhitespace(escaped);
			escaped = escapeForJson(escaped);
			escaped = normalize(escaped);
			escaped = escapeHtml(escaped);

			return escaped;
		} else {
			return "";
		}
	}

	public static String normalize(String content) {
		return content; //StringUtils.normalizeSpace(content);
	}
}
