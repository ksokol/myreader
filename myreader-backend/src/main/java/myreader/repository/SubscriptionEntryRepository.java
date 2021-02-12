package myreader.repository;

import myreader.entity.SubscriptionEntry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.Optional;
import java.util.Set;

public interface SubscriptionEntryRepository extends JpaRepository<SubscriptionEntry, Long>, SubscriptionEntryRepositoryCustom {

  @Query("select se from SubscriptionEntry se join fetch se.subscription where se.id = ?1")
  @Override
  Optional<SubscriptionEntry> findById(Long id);

  @Query(value =
    "select distinct ufet.TAG from USER_FEED_ENTRY_TAGS as ufet" +
      " join USER_FEED_ENTRY as ufe on ufet.USER_FEED_ENTRY_ID = ufe.USER_FEED_ENTRY_ID" +
      " join USER_FEED as uf on ufe.USER_FEED_ENTRY_USER_FEED_ID = uf.USER_FEED_ID",
    nativeQuery = true
  )
  Set<String> findDistinctTags();

  @Query("select count(se) from SubscriptionEntry se where (se.title = ?1 or se.guid = ?2 or se.url = ?3) and se.subscription.id = ?4")
  int countByTitleOrGuidOrUrlAndSubscriptionId(String title, String guid, String url, Long feedId);

  long countBySubscriptionId(Long feedId);

  Page<SubscriptionEntry> findBySubscriptionIdOrderByCreatedAtDesc(Long feedId, Pageable pageable);

  @Query("select se.id from SubscriptionEntry se where se.subscription.id = ?1 and size(se.tags) = 0 and se.seen = true and se.createdAt < ?2")
  Page<Long> findAllIdsBySubscriptionIdAndTagsNotEmptyAndCreatedAt(Long id, Date retainDate, Pageable pageable);
}
