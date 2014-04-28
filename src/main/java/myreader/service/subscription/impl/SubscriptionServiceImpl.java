package myreader.service.subscription.impl;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */

import myreader.entity.Feed;
import myreader.entity.Subscription;
import myreader.entity.User;
import myreader.fetcher.FeedParser;
import myreader.fetcher.impl.FetchResult;
import myreader.repository.FeedRepository;
import myreader.repository.SubscriptionRepository;
import myreader.service.AccessDeniedException;
import myreader.service.EntityNotFoundException;
import myreader.service.feed.FeedService;
import myreader.service.search.SubscriptionSearchService;
import myreader.service.subscription.SubscriptionExistException;
import myreader.service.subscription.SubscriptionService;
import myreader.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.List;

@Service
public class SubscriptionServiceImpl implements SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserService userService;
    private final SubscriptionSearchService subscriptionSearchService;
    private final FeedService feedService;

    private final FeedParser parser;


    private final FeedRepository feedRepository;

    @Autowired
    public SubscriptionServiceImpl(SubscriptionRepository subscriptionRepository, UserService userService, SubscriptionSearchService subscriptionSearchService, FeedService feedService, FeedParser parser, FeedRepository feedRepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.userService = userService;
        this.subscriptionSearchService = subscriptionSearchService;
        this.feedService = feedService;
        this.parser = parser;
        this.feedRepository = feedRepository;
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
        Page<Subscription> subscriptions =  subscriptionRepository.findByUser(currentUser.getId(), pageable);

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

    @Override
    public Subscription subscribe(String url) {
        User user = userService.getCurrentUser();
        Subscription check = subscriptionRepository.findByUsernameAndFeedUrl(user.getEmail(), url);

        if(check != null) {
            throw new SubscriptionExistException();
        }

        Feed feed = feedRepository.findByUrl(url);

        if(feed == null) {
            FetchResult parseResult = parser.parse(url);

            feed = new Feed();
            feed.setUrl(url);
            feed.setTitle(parseResult.getTitle());
            feed = feedRepository.save(feed);
        }

        Subscription subscription = new Subscription();
        subscription.setTitle(feed.getTitle());
        subscription.setFeed(feed);
        subscription.setUser(user);
        subscriptionRepository.save(subscription);

        return subscription;
    }

}
