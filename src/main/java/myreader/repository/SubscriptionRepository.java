package myreader.repository;

import myreader.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    @Query("from Subscription where feed.url = ?0")
    List<Subscription> findByUrl(String url);

    @Query("from Subscription where user.email = ?1")
    List<Subscription> findByUsername(String username);

    @Query("from Subscription where id = ?0 and user.email = ?1")
    Subscription findByIdAndUsername(Long id, String username);

    @Query("from Subscription where user.email = ?0 and feed.url = ?1")
    Subscription findByUsernameAndFeedUrl(String username, String url);
}
