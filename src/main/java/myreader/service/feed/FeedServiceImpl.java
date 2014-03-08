package myreader.service.feed;

import myreader.entity.Subscription;
import myreader.repository.SubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
@Transactional
@Service
public class FeedServiceImpl implements FeedService {

    private final SubscriptionRepository subscriptionRepository;

    @Autowired
    public FeedServiceImpl(SubscriptionRepository subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }

    @Override
    public List<Subscription> findAllSubscriptionsByUrl(String url) {
        List<Subscription> subscriptions = subscriptionRepository.findByUrl(url);
        return subscriptions;
    }
}
