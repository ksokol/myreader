package myreader.service.feed;

import myreader.entity.Feed;
import myreader.fetcher.FeedParseException;
import myreader.fetcher.FeedParser;
import myreader.fetcher.persistence.FetchResult;
import myreader.repository.FeedRepository;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import static org.slf4j.LoggerFactory.getLogger;

/**
 * @author Kamill Sokol
 */
@Transactional
@Service
public class FeedService {

    private static final Logger LOG = getLogger(FeedService.class);

    private final FeedRepository feedRepository;
    private final FeedParser feedParser;

    @Autowired
    public FeedService(FeedRepository feedRepository, FeedParser feedParser) {
        this.feedRepository = feedRepository;
        this.feedParser = feedParser;
    }

    public Feed findByUrl(String url) {
        Feed feed = feedRepository.findByUrl(url);

        if(feed == null) {
            FetchResult parseResult = feedParser.parse(url);

            feed = new Feed();
            feed.setUrl(url);
            feed.setTitle(parseResult.getTitle());
            feed = feedRepository.save(feed);
        }

        return feed;
    }

    public boolean valid(String url) {
        if(!StringUtils.hasText(url)) {
            return false;
        }

        Feed feed = feedRepository.findByUrl(url);

        if(feed != null) {
            return true;
        }

        try {
            feedParser.parse(url);
            return true;
        } catch (FeedParseException exception) {
            LOG.warn("couldn't parse feed {}. error: {}", url, exception.getMessage());
        }

        return false;
    }
}
