package myreader.utils;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

/**
 * @author Kamill Sokol
 */
public final class UrlUtils {

    private static final String UTF_8 = "UTF-8";

    public static String encodeAsUTF8(Object toEncode) {
        try {
            return URLEncoder.encode(String.valueOf(toEncode), UTF_8);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

}
