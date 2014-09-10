package myreader.fetcher;

import com.sun.syndication.feed.synd.SyndContent;
import com.sun.syndication.feed.synd.SyndEntry;
import com.sun.syndication.feed.synd.SyndFeed;
import com.sun.syndication.io.SyndFeedInput;
import com.sun.syndication.io.XmlReader;
import myreader.fetcher.impl.*;
import myreader.fetcher.persistence.FetcherEntry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

//TODO introduce an interface
/**
 * @author Kamill Sokol
 */
@Service("parser")
public class FeedParser {

    private Logger log = LoggerFactory.getLogger(getClass());

    private HttpConnector httpConnector;

    @Autowired
    public FeedParser(HttpConnector httpConnector) {
        this.httpConnector = httpConnector;
    }

    public FetchResult parse(String feedUrl) {
        try {
            HttpObject httpObject = new HttpObject(feedUrl);
            httpConnector.connect(httpObject);

            SyndFeedInput input = new SyndFeedInput();
            SyndFeed feed;
            List<FetcherEntry> entries = new ArrayList<FetcherEntry>();
            String lastModified;

            lastModified = httpObject.getLastModified();
            XmlReader xml = new XmlReader(httpObject.getResponseBody());
            feed = input.build(xml);

            List<SyndEntry> lfe = feed.getEntries();
            int i = 0;

            for (SyndEntry e : lfe) {
                i++;
                FetcherEntry dto = new FetcherEntry();

                dto.setGuid(e.getUri());
                dto.setTitle(StringDecoder.escapeSimpleHtml(e.getTitle()));

                dto.setUrl(EntryLinkSanitizer.sanitize(e.getLink(), feed.getLink(), feedUrl));
                SyndContent con = e.getDescription();
                String content = con == null ? null : con.getValue();

                if (content == null || content.isEmpty()) {
                    List contents = e.getContents();
                    if(!contents.isEmpty()) {
                        SyndContent syndContent = (SyndContent) contents.get(0);
                        content = syndContent.getValue();
                    }
                }

                dto.setContent(StringDecoder.escapeHtmlContent(content, feedUrl));

                entries.add(dto);
                if (i == 10)
                    break;
            }

            Collections.reverse(entries);
            return new FetchResult(entries, lastModified);
        } catch (Exception e) {
            log.warn("url: {}, message: {}", feedUrl, e.getMessage());
            throw new FeedParseException(e.getMessage(), e);
        }
    }
}