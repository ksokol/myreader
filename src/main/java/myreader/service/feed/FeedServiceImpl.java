package myreader.service.feed;

import myreader.entity.Subscription;
import myreader.repository.SubscriptionRepository;
import myreader.solr.SubscriptionSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
@Transactional
@Service
public class FeedServiceImpl implements FeedService {

    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionSearchService searchService;

    @Autowired
    public FeedServiceImpl(SubscriptionRepository subscriptionRepository, SubscriptionSearchService searchService) {
        this.subscriptionRepository = subscriptionRepository;
        this.searchService = searchService;
    }

    @Override
    public List<Subscription> findAllSubscriptionsByUrl(String url) {
        List<Subscription> subscriptions = subscriptionRepository.findByUrl(url);
        Map<Long,Long> counts = searchService.countUnseenEntries();

        for(Subscription s : subscriptions) {
            Long count = counts.get(s.getId());

            if(count != null) {
                s.setUnseen(count);
            }
        }

        return subscriptions;
    }
}
