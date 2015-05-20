package myreader.service.subscription;

import java.util.List;

import myreader.entity.Subscription;

/**
 * @author Kamill Sokol
 */
public interface SubscriptionService {

    List<Subscription> findAll();

    Subscription findById(Long id);

    Subscription findByUrl(String url);

    void save(Subscription subscription);

    Subscription subscribe(Long userId, String url);
}
