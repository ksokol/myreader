package myreader.service.feed;

import myreader.entity.Feed;
import myreader.fetcher.FeedParser;
import myreader.fetcher.persistence.FetchResult;
import myreader.repository.FeedRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author Kamill Sokol
 */
@Transactional
@Service
public class FeedService {

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
}
