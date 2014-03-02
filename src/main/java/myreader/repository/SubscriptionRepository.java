package myreader.repository;

import myreader.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    @Query("from Subscription where feed.url = ?1")
    List<Subscription> findByUrl(String url);

    @Query("from Subscription s join fetch s.feed where s.user.id = ?1")
    List<Subscription> findByUser(Long id);

    @Query("from Subscription where id = ?1 and user.email = ?2")
    Subscription findByIdAndUsername(Long id, String username);

    @Query("from Subscription where user.email = ?1 and feed.url = ?2")
    Subscription findByUsernameAndFeedUrl(String username, String url);
}
