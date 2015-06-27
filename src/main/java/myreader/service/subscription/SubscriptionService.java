package myreader.service.subscription;

import myreader.entity.Subscription;

/**
 * @author Kamill Sokol
 */
public interface SubscriptionService {

    Subscription findById(Long id);

    void save(Subscription subscription);

    Subscription subscribe(Long userId, String url);
}
