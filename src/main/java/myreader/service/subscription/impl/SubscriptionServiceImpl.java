package myreader.service.subscription.impl;

import myreader.entity.Feed;
import myreader.entity.Subscription;
import myreader.entity.User;
import myreader.repository.SubscriptionRepository;
import myreader.repository.UserRepository;
import myreader.service.AccessDeniedException;
import myreader.service.EntityNotFoundException;
import myreader.service.feed.FeedService;
import myreader.service.search.SubscriptionSearchService;
import myreader.service.subscription.SubscriptionExistException;
import myreader.service.subscription.SubscriptionService;
import myreader.service.time.TimeService;
import myreader.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.util.List;

/**
 * @author Kamill Sokol
 */
@Service
public class SubscriptionServiceImpl implements SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserService userService;
    private final UserRepository userRepository;
    private final SubscriptionSearchService subscriptionSearchService;
    private final FeedService feedService;
    private final TimeService timeService;

    @Autowired
    public SubscriptionServiceImpl(SubscriptionRepository subscriptionRepository, UserService userService, UserRepository userRepository, SubscriptionSearchService subscriptionSearchService, FeedService feedService, TimeService timeService) {
        this.subscriptionRepository = subscriptionRepository;
        this.userService = userService;
        this.userRepository = userRepository;
        this.subscriptionSearchService = subscriptionSearchService;
        this.feedService = feedService;
        this.timeService = timeService;
    }

    @Override
    public void delete(Long id) {
        User currentUser = userService.getCurrentUser();
        Subscription subscription = subscriptionRepository.findOne(id);

        if(subscription == null) {
            throw new EntityNotFoundException();
        }

        if(subscription.getUser().equals(currentUser)) {
            subscriptionRepository.delete(subscription.getId());
            subscriptionSearchService.delete(subscription.getId());
        } else {
            throw new AccessDeniedException();
        }
    }

    @Override
    public List<Subscription> findAll() {
        User currentUser = userService.getCurrentUser();
        List<Subscription> subscriptions =  subscriptionRepository.findByUser(currentUser.getId());

        return subscriptions;
    }

    @Override
    public Page<Subscription> findAll(Pageable pageable) {
        User currentUser = userService.getCurrentUser();
        Page<Subscription> subscriptions =  subscriptionRepository.findAllByUser(currentUser.getId(), pageable);

        return subscriptions;
    }

    @Override
    public Subscription findById(Long id) {
        User currentUser = userService.getCurrentUser();
        Subscription subscription = subscriptionRepository.findByIdAndUsername(id, currentUser.getEmail());

        if(subscription == null) {
            throw new EntityNotFoundException();
        }

        return subscription;
    }

    @Override
    public List<Subscription> findByTag(String tag) {
        Assert.notNull(tag);
        User currentUser = userService.getCurrentUser();
        return subscriptionRepository.findByTagAndUsername(tag, currentUser.getEmail());
    }

    @Override
    public Subscription findByUrl(String url) {
        User currentUser = userService.getCurrentUser();
        Subscription subscription = subscriptionRepository.findByUsernameAndFeedUrl(currentUser.getEmail(), url);

        if(subscription == null) {
            throw new EntityNotFoundException();
        }

        return subscription;
    }

    @Override
    public void save(Subscription subscription) {
        subscriptionRepository.save(subscription);
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
