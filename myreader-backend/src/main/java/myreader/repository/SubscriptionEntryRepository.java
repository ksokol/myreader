package myreader.repository;

import myreader.entity.SubscriptionEntry;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 * @author Kamill Sokol
 */
public interface SubscriptionEntryRepository extends JpaRepository<SubscriptionEntry, Long>, SubscriptionEntryRepositoryCustom {

    @Query("select se from SubscriptionEntry se join fetch se.subscription join fetch se.feedEntry where se.id = ?1 and se.subscription.user.email = ?2")
    SubscriptionEntry findByIdAndUsername(Long id, String username);

    @Query(value="select se from SubscriptionEntry se join fetch se.feedEntry join fetch se.subscription",countQuery = "select count(se) from SubscriptionEntry se")
    @Override
    Page<SubscriptionEntry> findAll(Pageable pageable);

    @Query(value="select se from SubscriptionEntry se join fetch se.feedEntry join fetch se.subscription where se.subscription.id = ?2 and se.subscription.user.id = ?1 and se.id <= ?3 order by se.id desc")
    Slice<SubscriptionEntry> findBySubscriptionAndUser(Long userId, Long subscriptionId, Long nextId, Pageable pageable);

    @Query("select se from SubscriptionEntry se join fetch se.subscription join fetch se.feedEntry where se.id = ?1")
    @Override
    SubscriptionEntry findOne(Long id);

}
