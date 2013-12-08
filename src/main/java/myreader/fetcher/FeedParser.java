package myreader.fetcher;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import myreader.fetcher.impl.FetchResult;
import myreader.fetcher.impl.HttpConnector;
import myreader.fetcher.impl.HttpObject;
import myreader.fetcher.impl.StringDecoder;
import myreader.fetcher.persistence.FetcherEntry;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sun.syndication.feed.synd.SyndContent;
import com.sun.syndication.feed.synd.SyndEntry;
import com.sun.syndication.feed.synd.SyndFeed;
import com.sun.syndication.io.SyndFeedInput;
import com.sun.syndication.io.XmlReader;

@Service("parser")
public class FeedParser {

    private Logger logger = LoggerFactory.getLogger(getClass());

    private HttpConnector httpConnector;

    @Autowired
    public FeedParser(HttpConnector httpConnector) {
        this.httpConnector = httpConnector;
    }

    @SuppressWarnings("unchecked")
    public FetchResult parse(String feedUrl) {
        try {
            HttpObject httpObject = new HttpObject(feedUrl);
            httpConnector.connect(httpObject);

            SyndFeedInput input = new SyndFeedInput();
            SyndFeed feed = null;
            List<FetcherEntry> entries = new ArrayList<FetcherEntry>();
            String lastModified = null;

            lastModified = httpObject.getLastModified();
            XmlReader xml = new XmlReader(httpObject.getResponseBody());
            feed = input.build(xml); // java.lang.IllegalStateException

            List<SyndEntry> lfe = feed.getEntries();
            int i = 0;

            for (SyndEntry e : lfe) {
                i++;
                FetcherEntry dto = new FetcherEntry();

                dto.setGuid(e.getUri());
                dto.setTitle(StringDecoder.escapeSimpleHtml(e.getTitle()));

                dto.setUrl(e.getLink());
                SyndContent con = e.getDescription();

                if (con != null) {
                    dto.setContent(StringDecoder.escapeHtmlContent(con.getValue(), feedUrl));
                }

                entries.add(dto);
                if (i == 10)
                    break;
            }

            Collections.reverse(entries);
            return new FetchResult(entries, lastModified);
        } catch (Exception e) {
            logger.warn("url: {}, message: {}", feedUrl, e.getMessage());
            throw new FeedParseException(e.getMessage(), e);
        }
    }
}