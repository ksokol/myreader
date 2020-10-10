package myreader.repository;

import myreader.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    @Query(value =
            "select s from Subscription s join fetch s.feed left join fetch s.subscriptionTag where s.user.id = ?2 " +
            "and (select count(1) from SubscriptionEntry se where se.subscription.id = s.id and se.seen = false) > ?1 " +
            "order by s.createdAt desc"
    )
    List<Subscription> findAllByUnseenGreaterThanAndUserId(long unseenCount, long userId);

    @Query("select s from Subscription s join fetch s.feed left join fetch s.subscriptionTag where s.id = ?1 and s.user.id = ?2")
    Optional<Subscription> findByIdAndUserId(Long id, long userId);

    @Query("select s from Subscription s where s.user.id = ?2 and s.feed.url = ?1")
    Optional<Subscription> findByFeedUrlAndUserId(String url, long userId);

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
