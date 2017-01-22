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

    @Query(value="select s from Subscription s join fetch s.feed where s.user.email = ?#{principal.username} " +
                 "and (select count(1) from SubscriptionEntry se where se.subscription.id = s.id and se.seen = false) > ?1")
    List<Subscription> findAllByUnseenGreaterThanAndCurrentUser(long unseenCount);

    @Query("select s from Subscription s join fetch s.feed where s.id = ?1 and s.user.email = ?#{principal.username}")
    Subscription findByIdAndCurrentUser(Long id);

    @Query("select s from Subscription s where s.user.email = ?#{principal.username} and s.feed.url = ?1")
    Subscription findByFeedUrlAndCurrentUser(String url);

    Subscription findByUserEmailAndFeedUrl(String email, String url);

    @Query("select distinct(s.tag) from Subscription as s where s.user.email = ?#{principal.username} and s.tag is not null")
    List<String> findDistinctTagsByCurrentUser();

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
