package myreader.service.subscription;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
import myreader.entity.Subscription;
import myreader.entity.User;
import myreader.repository.SubscriptionRepository;
import myreader.service.AccessDeniedException;
import myreader.service.EntityNotFoundException;
import myreader.service.user.UserService;
import myreader.solr.IndexService;
import myreader.solr.SubscriptionSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class SubscriptionServiceImpl implements SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserService userService;
    private final IndexService indexService;
    private final SubscriptionSearchService searchService;

    @Autowired
    public SubscriptionServiceImpl(SubscriptionRepository subscriptionRepository, UserService userService, IndexService indexService, SubscriptionSearchService searchService) {
        this.subscriptionRepository = subscriptionRepository;
        this.userService = userService;
        this.indexService = indexService;
        this.searchService = searchService;
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
        } else {
            throw new AccessDeniedException();
        }
    }

    @Override
    public List<Subscription> findAll() {
        User currentUser = userService.getCurrentUser();
        List<Subscription> subscriptions =  subscriptionRepository.findByUser(currentUser.getId());
        Map<Long,Long> counts = searchService.countUnseenEntriesByUser(currentUser.getEmail());

        for(Subscription s : subscriptions) {
            Long count = counts.get(s.getId());

            if(count != null) {
                s.setUnseen(count);
            }
        }

        return subscriptions;
    }

    @Override
    public Subscription findById(Long id) {
        User currentUser = userService.getCurrentUser();
        Subscription subscription = subscriptionRepository.findByIdAndUsername(id, currentUser.getEmail());

        if(subscription == null) {
            throw new EntityNotFoundException();
        }

        long l = searchService.countUnseenEntriesById(subscription.getId());
        subscription.setUnseen(l);

        return subscription;
    }

    @Override
    public Subscription findByUrl(String url) {
        User currentUser = userService.getCurrentUser();
        Subscription subscription = subscriptionRepository.findByUsernameAndFeedUrl(currentUser.getEmail(), currentUser.getEmail());

        if(subscription == null) {
            throw new EntityNotFoundException();
        }

        long l = searchService.countUnseenEntriesById(subscription.getId());
        subscription.setUnseen(l);

        return subscription;
    }

    @Override
    public void save(Subscription subscription) {
        subscriptionRepository.save(subscription);
        indexService.save(subscription);
    }

}
