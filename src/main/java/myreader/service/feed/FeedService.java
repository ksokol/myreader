package myreader.service.feed;

import myreader.entity.Feed;

/**
 * @author Kamill Sokol
 */
public interface FeedService {

    Feed createFromUrl(String url);

    Feed findByUrl(String url);
}
