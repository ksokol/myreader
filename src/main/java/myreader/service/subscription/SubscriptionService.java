package myreader.service.subscription;

import java.util.List;

import myreader.entity.Subscription;

/**
 * @author Kamill Sokol
 */
public interface SubscriptionService {

    void delete(Long id);

    List<Subscription> findAll();

    Subscription findById(Long id);

    List<Subscription> findByTag(String tag);

    List<Subscription> findByTitle(String title);

    Subscription findByUrl(String url);

    void save(Subscription subscription);

    Subscription subscribe(Long userId, String url);
}
