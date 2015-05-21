package myreader.repository;

import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Set;

/**
 * @author Kamill Sokol
 */
public interface SubscriptionEntryRepository extends JpaRepository<SubscriptionEntry, Long>, SubscriptionEntryRepositoryCustom {

    @Query("select se from SubscriptionEntry se join fetch se.subscription join fetch se.feedEntry where se.id = ?1 and se.subscription.user.email = ?2")
    SubscriptionEntry findByIdAndUsername(Long id, String username);

    @Deprecated
    @Query("select distinct se.tag from SubscriptionEntry se where se.tag is not null and se.subscription.user.email = ?1 order by se.tag asc")
    List<String> findDistinctTagsByUsername(String username);

    @Query(value="select se from SubscriptionEntry se join fetch se.feedEntry join fetch se.subscription",countQuery = "select count(se) from SubscriptionEntry se")
    @Override
    Page<SubscriptionEntry> findAll(Pageable pageable);

    @Query(value="select se from SubscriptionEntry se join fetch se.feedEntry join fetch se.subscription where se.subscription.id = ?2 and se.subscription.user.id = ?1 and se.id <= ?3 order by se.id desc")
    Slice<SubscriptionEntry> findBySubscriptionAndUser(Long userId, Long subscriptionId, Long nextId, Pageable pageable);

    @Query("select count(se) from SubscriptionEntry se where se.subscription = ?1 and se.seen = ?2")
    int countBySeen(Subscription subscription, boolean flag);

    @Query("select se from SubscriptionEntry se join fetch se.subscription join fetch se.feedEntry where se.id = ?1")
    @Override
    SubscriptionEntry findOne(Long id);

}
