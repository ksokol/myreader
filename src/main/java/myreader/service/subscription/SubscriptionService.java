package myreader.service.subscription;

import myreader.entity.Subscription;

/**
 * @author Kamill Sokol
 */
public interface SubscriptionService {

    Subscription findById(Long id);

    Subscription subscribe(Long userId, String url);
}
