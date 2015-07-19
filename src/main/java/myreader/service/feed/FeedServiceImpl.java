package myreader.service.feed;

import myreader.entity.Feed;
import myreader.fetcher.FeedParseException;
import myreader.fetcher.FeedParser;
import myreader.fetcher.persistence.FetchResult;
import myreader.repository.FeedRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

/**
 * @author Kamill Sokol
 */
@Transactional
@Service
public class FeedServiceImpl implements FeedService {

    private final FeedRepository feedRepository;
    private final FeedParser feedParser;

    @Autowired
    public FeedServiceImpl(FeedRepository feedRepository, FeedParser feedParser) {
        this.feedRepository = feedRepository;
        this.feedParser = feedParser;
    }

    @Override
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

    @Override
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
            //ignore
        }

        return false;
    }
}
