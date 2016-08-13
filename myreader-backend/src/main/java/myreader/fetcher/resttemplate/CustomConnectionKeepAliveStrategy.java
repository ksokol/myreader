package myreader.fetcher.resttemplate;

import org.apache.http.HeaderElement;
import org.apache.http.HeaderElementIterator;
import org.apache.http.HttpResponse;
import org.apache.http.conn.ConnectionKeepAliveStrategy;
import org.apache.http.message.BasicHeaderElementIterator;
import org.apache.http.protocol.HTTP;
import org.apache.http.protocol.HttpContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @since 2016-07
 */
class CustomConnectionKeepAliveStrategy implements ConnectionKeepAliveStrategy {

    private static final Logger log = LoggerFactory.getLogger(CustomConnectionKeepAliveStrategy.class);

    private final long keepAlive;

    public CustomConnectionKeepAliveStrategy(long keepAlive) {
        this.keepAlive = keepAlive;
    }

    @Override
    public long getKeepAliveDuration(HttpResponse response, HttpContext context) {
        // Honor 'keep-alive' header
        HeaderElementIterator it = new BasicHeaderElementIterator(response.headerIterator(HTTP.CONN_KEEP_ALIVE));
        while (it.hasNext()) {
            HeaderElement he = it.nextElement();
            String param = he.getName();
            String value = he.getValue();
            if (value != null && param.equalsIgnoreCase("timeout")) {
                try {
                    return Long.parseLong(value) * 1000;
                } catch (NumberFormatException ignore) {
                    log.debug("could not parse number from timeout header");
                }
            }
        }
        return keepAlive;
    }
}
