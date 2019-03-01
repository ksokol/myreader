package myreader.service.feed;

import myreader.entity.Feed;
import myreader.fetcher.FeedParseException;
import myreader.fetcher.FeedParser;
import myreader.fetcher.persistence.FetchResult;
import myreader.repository.FeedRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import static java.util.Objects.requireNonNull;

/**
 * @author Kamill Sokol
 */
@Component
@Transactional
public class FeedService {

    private static final Logger LOG = LoggerFactory.getLogger(FeedService.class);

    private final FeedRepository feedRepository;
    private final FeedParser feedParser;

    @Autowired
    public FeedService(FeedRepository feedRepository, FeedParser feedParser) {
        this.feedRepository = requireNonNull(feedRepository, "feedRepository is null");
        this.feedParser = requireNonNull(feedParser, "feedParser is null");
    }

    public Feed findByUrl(String url) {
        Feed feed = feedRepository.findByUrl(url);

        if(feed == null) {
            FetchResult parseResult = feedParser.parse(url).orElseThrow(IllegalArgumentException::new);

            feed = new Feed(url, parseResult.getTitle());
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
            LOG.warn("couldn't parse feed. error: {}", exception.getMessage());
        }

        return false;
    }
}
