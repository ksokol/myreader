package myreader.service.subscription;

import myreader.entity.Subscription;

import java.util.List;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
public interface SubscriptionService {

    void delete(Long id);

    List<Subscription> findAll();

    Subscription findById(Long id);

    Subscription findByUrl(String url);

    void save(Subscription subscription);
}
