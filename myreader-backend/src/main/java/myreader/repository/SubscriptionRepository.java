package myreader.repository;

import myreader.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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

    @Query("select s from Subscription s join fetch s.feed where s.id = ?1 and s.user.email = ?2")
    Subscription findByIdAndUsername(Long id, String username);

    @Query("select s from Subscription s where s.user.email = ?1 and s.feed.url = ?2")
    Subscription findByUsernameAndFeedUrl(String username, String url);

    @Query("select s from Subscription s where s.user.id = ?1 and s.feed.url = ?2")
    Subscription findByUserIdAndFeedUrl(Long id, String url);

    @Modifying
    @Query("update Subscription set unseen = unseen-1 where id = ?1")
    void decrementUnseen(Long id);

    @Modifying
    @Query("update Subscription set unseen = unseen+1 where id = ?1")
    void incrementUnseen(Long id);

    @Query("select distinct(s.tag) from Subscription as s where s.user.id = ?1 and s.tag is not null")
    List<String> findDistinctTags(long userId);

    @Transactional
    @Query("update Subscription set lastFeedEntryId = ?1 where id = ?2")
    @Modifying
    void updateLastFeedEntryId(Long feedEntryId, Long subscriptionId);

    @Transactional
    @Query("update Subscription set lastFeedEntryId = ?1, unseen = unseen + 1, fetchCount = fetchCount + 1 where id = ?2")
    @Modifying
    void updateLastFeedEntryIdAndIncrementUnseenAndIncrementFetchCount(Long feedEntryId, Long subscriptionId);
}
