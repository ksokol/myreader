package myreader.resource.utils;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

/**
 * @author Kamill Sokol
 */
public final class EncodeUtils {
	private EncodeUtils() {}

	public static String encodeAsUTF8(String toEncode) {
		try {
			return URLEncoder.encode(toEncode, "UTF-8");
		} catch (UnsupportedEncodingException e) {
			throw new RuntimeException(e.getMessage(), e);
		}
	}
}
