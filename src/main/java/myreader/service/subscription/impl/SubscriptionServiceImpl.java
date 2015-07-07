package myreader.service.subscription.impl;

import myreader.entity.Feed;
import myreader.entity.Subscription;
import myreader.entity.User;
import myreader.repository.SubscriptionRepository;
import myreader.repository.UserRepository;
import myreader.service.feed.FeedService;
import myreader.service.subscription.SubscriptionExistException;
import myreader.service.subscription.SubscriptionService;
import myreader.service.time.TimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author Kamill Sokol
 */
@Service
public class SubscriptionServiceImpl implements SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final FeedService feedService;
    private final TimeService timeService;

    @Autowired
    public SubscriptionServiceImpl(SubscriptionRepository subscriptionRepository, UserRepository userRepository, FeedService feedService, TimeService timeService) {
        this.subscriptionRepository = subscriptionRepository;
        this.userRepository = userRepository;
        this.feedService = feedService;
        this.timeService = timeService;
    }

    @Transactional
    @Override
    public Subscription subscribe(Long userId, String url) {
        Subscription check = subscriptionRepository.findByUserIdAndFeedUrl(userId, url);

        if(check != null) {
            throw new SubscriptionExistException();
        }

        Feed feed = feedService.findByUrl(url);
        User user = userRepository.findOne(userId);

        if(user == null) {
            throw new IllegalArgumentException();
        }

        Subscription subscription = new Subscription();
        subscription.setTitle(feed.getTitle());
        subscription.setFeed(feed);
        subscription.setUser(user);
        subscription.setCreatedAt(timeService.getCurrentTime());
        return subscriptionRepository.save(subscription);
    }

}
