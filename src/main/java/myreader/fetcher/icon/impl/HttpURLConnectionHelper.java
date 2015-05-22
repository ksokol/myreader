package myreader.fetcher.icon.impl;

import java.net.HttpURLConnection;
import java.net.URL;

public class HttpURLConnectionHelper {

    private static final String USER_AGENT = "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:14.0) Gecko/20100101 Firefox/14.0.1";

    public static HttpURLConnection getHttpURLConnection(String url) {
        try {
            URL feedUrl = new URL(url);
            HttpURLConnection urlc = (HttpURLConnection) feedUrl.openConnection();

            urlc.setReadTimeout(3000);
            urlc.setConnectTimeout(3000);
            urlc.setRequestMethod("GET");
            urlc.setRequestProperty("User-Agent", USER_AGENT);
            urlc.setInstanceFollowRedirects(true);
            HttpURLConnection.setFollowRedirects(true);

            return urlc;

        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

}
