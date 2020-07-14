package myreader.repository;

import myreader.entity.SubscriptionEntry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.Set;

/**
 * @author Kamill Sokol
 */
public interface SubscriptionEntryRepository extends JpaRepository<SubscriptionEntry, Long>, SubscriptionEntryRepositoryCustom {

    @Query("select se from SubscriptionEntry se join fetch se.subscription join fetch se.feedEntry where se.id = ?1 and se.subscription.user.id = ?2")
    Optional<SubscriptionEntry> findByIdAndUserId(Long id, Long userId);

    @Query(
            value="select se from SubscriptionEntry se join fetch se.feedEntry join fetch se.subscription",
            countQuery = "select count(se) from SubscriptionEntry se"
    )
    @Override
    Page<SubscriptionEntry> findAll(Pageable pageable);

    @Query("select se from SubscriptionEntry se join fetch se.subscription join fetch se.feedEntry where se.id = ?1")
    @Override
    Optional<SubscriptionEntry> findById(Long id);

    @Query("select count(se) > 0 from SubscriptionEntry se where se.feedEntry.id = ?1 and se.subscription.id = ?2")
    boolean contains(Long feedEntryId, Long subscriptionId);

    @Query(value =
            "select distinct ufet.TAG from USER_FEED_ENTRY_TAGS as ufet" +
            " join USER_FEED_ENTRY as ufe on ufet.USER_FEED_ENTRY_ID = ufe.USER_FEED_ENTRY_ID" +
            " join USER_FEED as uf on ufe.USER_FEED_ENTRY_USER_FEED_ID = uf.USER_FEED_ID" +
            " where uf.USER_FEED_USER_ID = ?1",
            nativeQuery = true
    )
    Set<String> findDistinctTagsByUserId(long userId);
}
