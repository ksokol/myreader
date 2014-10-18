package myreader.repository;

import java.util.List;

import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 * @author Kamill Sokol
 */
public interface SubscriptionEntryRepository extends JpaRepository<SubscriptionEntry, Long> {

    @Query("select se from SubscriptionEntry se join fetch se.subscription join fetch se.feedEntry where se.id = ?1 and se.subscription.user.email = ?2")
    SubscriptionEntry findByIdAndUsername(Long id, String username);

    @Query("select distinct se.tag from SubscriptionEntry se where se.tag is not null and se.subscription.user.email = ?1 order by se.tag asc")
    List<String> findDistinctTagsByUsername(String username);

    @Query(value="select se from SubscriptionEntry se join fetch se.feedEntry join fetch se.subscription",countQuery = "select count(se) from SubscriptionEntry se")
    @Override
    Page<SubscriptionEntry> findAll(Pageable pageable);

    @Query(value="select se, se.feedEntry, se.subscription, se.subscription.feed from SubscriptionEntry se join fetch se.feedEntry join fetch se.subscription join fetch se.subscription.feed where se.id in (?1) order by se.id desc")
    @Override
    List<SubscriptionEntry> findAll(Iterable<Long> ids);

    @Query(value="select se from SubscriptionEntry se join fetch se.feedEntry join fetch se.subscription where se.subscription.id = ?2 and se.subscription.user.id = ?1")
    Slice<SubscriptionEntry> findBySubscriptionAndUser(Long userId, Long subscriptionId, Pageable pageable);

    @Query(value="select se from SubscriptionEntry se join fetch se.feedEntry join fetch se.subscription where se.subscription.id = ?2 and se.subscription.user.id = ?1 and se.seen = false")
    Slice<SubscriptionEntry> findNewBySubscriptionAndUser(Long userId, Long subscriptionId, Pageable pageable);

    @Query(value="select se from SubscriptionEntry se join fetch se.feedEntry join fetch se.subscription where se.subscription.tag = ?2 and se.subscription.user.id = ?1 and se.seen = false")
    Slice<SubscriptionEntry> findNewBySubscriptionTagAndUser(Long userId, String tag, Pageable pageable);

    @Query(value="select se from SubscriptionEntry se join fetch se.feedEntry join fetch se.subscription where se.subscription.user.id = ?1")
    Slice<SubscriptionEntry> findAllByUser(Pageable pageable, Long id);

    @Query("select count(se) from SubscriptionEntry se where se.subscription = ?1 and se.seen = ?2")
    int countBySeen(Subscription subscription, boolean flag);

    @Query(value="select se from SubscriptionEntry se join fetch se.feedEntry join fetch se.subscription where se.subscription.tag = ?1 and se.subscription" +
            ".user.id = ?2")
    Slice<SubscriptionEntry> findBySubscriptionTagAndUser(String tag, Long userId, Pageable pageable);

    @Query("select se from SubscriptionEntry se join fetch se.subscription join fetch se.feedEntry where se.id = ?1")
    @Override
    SubscriptionEntry findOne(Long id);
}
