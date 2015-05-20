package myreader.repository;

import java.util.List;

import javax.persistence.LockModeType;

import myreader.entity.Subscription;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

/**
 * @author Kamill Sokol
 */
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    @Query("select s from Subscription s join fetch s.feed where s.id = ?1")
    @Override
    Subscription findOne(Long id);

    @Query("select s from Subscription s where s.feed.url = ?1")
    List<Subscription> findByUrl(String url);

    @Query(value="select s from Subscription s join fetch s.feed where s.user.id = ?1 and s.unseen > ?2")
    List<Subscription> findAllByUserAndUnseenGreaterThan(Long id, Integer unseenCount);

    @Deprecated
    @Query("select s from Subscription s join fetch s.feed where s.title = ?1 and s.user.email = ?2")
    List<Subscription> findByTitleAndUsername(String title, String username);

    @Query("select s from Subscription s join fetch s.feed where s.user.id = ?1")
    List<Subscription> findByUser(Long id);

    @Query("select s from Subscription s join fetch s.feed where s.id = ?1 and s.user.email = ?2")
    Subscription findByIdAndUsername(Long id, String username);

    @Query("select s from Subscription s where s.user.email = ?1 and s.feed.url = ?2")
    Subscription findByUsernameAndFeedUrl(String username, String url);

    @Query("select s from Subscription s where s.user.id = ?1 and s.feed.url = ?2")
    Subscription findByUserIdAndFeedUrl(Long id, String url);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Modifying
    @Query("update Subscription set unseen = ?1 where id = ?2")
    void updateUnseen(int count, Long id);

    @Modifying
    @Query("update Subscription set unseen = unseen-1 where id = ?1")
    void decrementUnseen(Long id);

    @Modifying
    @Query("update Subscription set unseen = unseen+1 where id = ?1")
    void incrementUnseen(Long id);
}
