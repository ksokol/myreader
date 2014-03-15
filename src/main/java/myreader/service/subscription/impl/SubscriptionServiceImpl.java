package myreader.service.subscription.impl;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
import myreader.entity.Subscription;
import myreader.entity.User;
import myreader.repository.SubscriptionRepository;
import myreader.service.AccessDeniedException;
import myreader.service.EntityNotFoundException;
import myreader.service.subscription.SubscriptionService;
import myreader.service.user.UserService;
import myreader.service.search.IndexService;
import myreader.service.search.SubscriptionSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubscriptionServiceImpl implements SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserService userService;
    private final IndexService indexService;
    private final SubscriptionSearchService subscriptionSearchService;

    @Autowired
    public SubscriptionServiceImpl(SubscriptionRepository subscriptionRepository, UserService userService, IndexService indexService, SubscriptionSearchService subscriptionSearchService) {
        this.subscriptionRepository = subscriptionRepository;
        this.userService = userService;
        this.indexService = indexService;
        this.subscriptionSearchService = subscriptionSearchService;
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
    public Subscription findById(Long id) {
        User currentUser = userService.getCurrentUser();
        Subscription subscription = subscriptionRepository.findByIdAndUsername(id, currentUser.getEmail());

        if(subscription == null) {
            throw new EntityNotFoundException();
        }

        return subscription;
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
        indexService.save(subscription);
    }

}
