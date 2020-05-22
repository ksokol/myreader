package myreader.repository;

import myreader.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * @author Kamill Sokol
 */
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    @Query(value="select s from Subscription s join fetch s.feed left join fetch s.subscriptionTag where s.user.email = ?#{principal.username} " +
                 "and (select count(1) from SubscriptionEntry se where se.subscription.id = s.id and se.seen = false) > ?1")
    List<Subscription> findAllByUnseenGreaterThanAndCurrentUser(long unseenCount);

    @Query("select s from Subscription s join fetch s.feed left join fetch s.subscriptionTag where s.id = ?1 and s.user.id = ?2")
    Optional<Subscription> findByIdAndUserId(Long id, long userId);

    @Query("select s from Subscription s where s.user.email = ?#{principal.username} and s.feed.url = ?1")
    Subscription findByFeedUrlAndCurrentUser(String url);

    Subscription findByUserEmailAndFeedUrl(String email, String url);

    @Transactional
    @Query("update Subscription set lastFeedEntryId = ?1 where id = ?2")
    @Modifying
    void updateLastFeedEntryId(Long feedEntryId, Long subscriptionId);

    @Transactional
    @Query("update Subscription set lastFeedEntryId = ?1, fetchCount = fetchCount + 1 where id = ?2")
    @Modifying
    void updateLastFeedEntryIdAndIncrementFetchCount(Long feedEntryId, Long subscriptionId);

    int countByFeedId(Long id);
}
