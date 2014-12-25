package myreader.fetcher.impl;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;

import javax.net.ssl.HttpsURLConnection;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * @author Kamill Sokol
 */
@Component("httpConnector")
public class HttpConnector {
    private static final Logger logger = LoggerFactory.getLogger(HttpConnector.class);

    private String userAgent = "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:14.0) Gecko/20100101 Firefox/14.0.1";
    private int connectTimeout = 30000;
    private int readTimeout = 30000;

    public void connect(HttpObject httpObject) {
        HttpURLConnection urlc = null;

        logger.debug("connecting with useragent: {}, connectTimeout {}, readTimeout {}", new Object[] { userAgent,
                connectTimeout, readTimeout });

        try {
            URL feedUrl = new URL(httpObject.getUrl());

            if(httpObject.getUrl().startsWith("https")) {
                EasySSLSocketFactory easySSLSocketFactory = new EasySSLSocketFactory(readTimeout, connectTimeout);
                HttpsURLConnection ssl = (HttpsURLConnection) feedUrl.openConnection();
                ssl.setSSLSocketFactory(easySSLSocketFactory);
                urlc = ssl;
            } else {
                urlc = (HttpURLConnection) feedUrl.openConnection();
            }

            urlc.setReadTimeout(readTimeout);
            urlc.setConnectTimeout(connectTimeout);
            urlc.setRequestMethod(httpObject.getMethod());
            urlc.setRequestProperty("User-Agent", userAgent);

            if (httpObject.getLastModified() != null) {
                urlc.setRequestProperty("If-Modified-Since", httpObject.getLastModified());
            }

            httpObject.setLastModified(urlc.getHeaderField("Last-Modified"));
            httpObject.setReturnCode(urlc.getResponseCode());
            httpObject.setResponseBody(urlc.getInputStream());

        } catch (Exception e) {
            logger.warn("url: {}, message: {}", httpObject.getUrl(), e.getMessage());
            if (urlc != null) {
                try {
                    httpObject.setReturnCode(urlc.getResponseCode());
                } catch (IOException e1) {
                    logger.warn("url: {}, message: {}", httpObject.getUrl(), e1.getMessage());
                    httpObject.setReturnCode(504);
                }
            } else {
                httpObject.setReturnCode(504);
            }
        }
    }
}
