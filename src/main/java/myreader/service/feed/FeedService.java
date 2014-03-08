package myreader.service.feed;

import myreader.entity.Subscription;

import java.util.List;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
public interface FeedService {

    List<Subscription> findAllSubscriptionsByUrl(String url);
}
