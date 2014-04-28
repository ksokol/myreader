package myreader.service.feed;

import myreader.entity.Feed;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
public interface FeedService {

    Feed createFromUrl(String url);
}
