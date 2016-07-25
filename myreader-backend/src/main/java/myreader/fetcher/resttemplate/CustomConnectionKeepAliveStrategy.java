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

import static org.apache.http.protocol.HttpContext.RESERVED_PREFIX;

/**
 * @since 2016-07
 */
class CustomConnectionKeepAliveStrategy implements ConnectionKeepAliveStrategy {

    private static final Logger LOG = LoggerFactory.getLogger(CustomConnectionKeepAliveStrategy.class);

    private final long keepAlive;

    CustomConnectionKeepAliveStrategy(long keepAlive) {
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
                    LOG.warn("could not parse keep-alive header value '{}' for '{}'", value, context.getAttribute(RESERVED_PREFIX + "target_host"));
                }
            }
        }
        return keepAlive;
    }
}
