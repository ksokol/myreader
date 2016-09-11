package myreader.service.subscription;

import myreader.entity.Feed;
import myreader.entity.Subscription;
import myreader.entity.User;
import myreader.repository.SubscriptionRepository;
import myreader.repository.UserRepository;
import myreader.service.feed.FeedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Date;

/**
 * @author Kamill Sokol
 */
@Service
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final FeedService feedService;
    private final Clock clock;

    @Autowired
    public SubscriptionService(SubscriptionRepository subscriptionRepository, UserRepository userRepository, FeedService feedService, Clock clock) {
        this.subscriptionRepository = subscriptionRepository;
        this.userRepository = userRepository;
        this.feedService = feedService;
        this.clock = clock;
    }

    @Transactional
    public Subscription subscribe(Long userId, String url) {
        Subscription check = subscriptionRepository.findByUserIdAndFeedUrl(userId, url);

        if(check != null) {
            throw new SubscriptionExistException();
        }

        Feed feed = feedService.findByUrl(url);
        User user = userRepository.findOne(userId);

        Subscription subscription = new Subscription();
        subscription.setTitle(feed.getTitle());
        subscription.setFeed(feed);
        subscription.setUser(user);
        subscription.setCreatedAt(now());
        return subscriptionRepository.save(subscription);
    }

    private Date now() {
        return Date.from(LocalDateTime.now(clock).toInstant(ZoneOffset.UTC));
    }
}
