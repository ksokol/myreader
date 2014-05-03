package myreader.repository;

import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * @author Kamill Sokol
 */
public interface SubscriptionEntryRepository extends JpaRepository<SubscriptionEntry, Long> {

    @Query("from SubscriptionEntry se join fetch se.feedEntry where se.id = ?1 and se.subscription.user.email = ?2")
    SubscriptionEntry findByIdAndUsername(Long id, String username);

    @Query("select distinct tag from SubscriptionEntry where tag is not null and subscription.user.email = ?1 order by tag asc")
    List<String> findDistinctTagsByUsername(String username);

    @Query(value="from SubscriptionEntry se join fetch se.feedEntry join fetch se.subscription",countQuery = "select count(*) from SubscriptionEntry")
    @Override
    Page<SubscriptionEntry> findAll(Pageable pageable);

    @Query(value="from SubscriptionEntry se join fetch se.feedEntry join fetch se.subscription join fetch se.subscription.feed where se.id in (?1) order by se.id desc")
    @Override
    List<SubscriptionEntry> findAll(Iterable<Long> ids);

    @Query(value="from SubscriptionEntry se join fetch se.feedEntry join fetch se.subscription where se.subscription.id = ?2 and se.subscription.user.id = ?1",countQuery = "select count(*) from SubscriptionEntry where subscription.id = ?2 and subscription.user.id = ?1")
    Page<SubscriptionEntry> findBySubscriptionAndUser(Long userId, Long subscriptionId, Pageable pageable);

    @Query(value="from SubscriptionEntry se join fetch se.feedEntry join fetch se.subscription where se.subscription.user.id = ?1",countQuery = "select count(*) from SubscriptionEntry se join se.subscription where se.subscription.user.id = ?1")
    Page<SubscriptionEntry> findAllByUser(Pageable pageable, Long id);

    @Query("select count(se) from SubscriptionEntry se where subscription = ?1 and seen = ?2")
    int countBySeen(Subscription subscription, boolean flag);
}
