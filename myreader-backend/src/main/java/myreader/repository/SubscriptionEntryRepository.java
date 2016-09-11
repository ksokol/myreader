package myreader.repository;

import myreader.entity.SubscriptionEntry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 * @author Kamill Sokol
 */
public interface SubscriptionEntryRepository extends JpaRepository<SubscriptionEntry, Long>, SubscriptionEntryRepositoryCustom {

    @Query("select se from SubscriptionEntry se join fetch se.subscription join fetch se.feedEntry where se.id = ?1 and se.subscription.user.email = ?#{principal.username}")
    SubscriptionEntry findByIdAndCurrentUser(Long id);

    @Query(value="select se from SubscriptionEntry se join fetch se.feedEntry join fetch se.subscription",countQuery = "select count(se) from SubscriptionEntry se")
    @Override
    Page<SubscriptionEntry> findAll(Pageable pageable);

    @Query("select se from SubscriptionEntry se join fetch se.subscription join fetch se.feedEntry where se.id = ?1")
    @Override
    SubscriptionEntry findOne(Long id);

    @Query("select count(se) > 0 from SubscriptionEntry se where se.feedEntry.id = ?1 and se.subscription.id = ?2")
    boolean contains(Long feedEntryId, Long subscriptionId);
}
