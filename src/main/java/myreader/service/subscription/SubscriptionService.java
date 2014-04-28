package myreader.service.subscription;

import myreader.entity.Subscription;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
public interface SubscriptionService {

    void delete(Long id);

    List<Subscription> findAll();

    Page<Subscription> findAll(Pageable pageable);

    Subscription findById(Long id);

    List<Subscription> findByTag(String tag);

    Subscription findByUrl(String url);

    void save(Subscription subscription);

    Subscription subscribe(String url);
}
