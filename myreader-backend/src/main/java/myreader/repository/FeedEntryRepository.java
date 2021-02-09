package myreader.repository;

import myreader.entity.FeedEntry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Date;

public interface FeedEntryRepository extends PagingAndSortingRepository<FeedEntry, Long> {

  @Query("select count(fe) from FeedEntry fe where (fe.title = ?1 or fe.guid = ?2 or fe.url = ?3) and fe.subscription.id = ?4")
  int countByTitleOrGuidOrUrlAndSubscriptionId(String title, String guid, String url, Long feedId);

  @Query("select fe from FeedEntry fe where fe.subscription.id = ?1")
  Page<FeedEntry> findBySubscriptionId(Long id, Pageable pageable);

  @Query(value = "select fe from FeedEntry fe where fe.id > ?1 and fe.subscription.id = ?2 order by fe.id asc")
  Slice<FeedEntry> findByGreaterThanFeedEntryId(Long feedEntry, Long feedId, Pageable pageable);

  long countBySubscriptionId(Long feedId);

  Page<FeedEntry> findBySubscriptionIdOrderByCreatedAtDesc(Long feedId, Pageable pageable);

  @Query("select distinct fe.id from FeedEntry fe left join fe.subscriptionEntries se" +
    " where fe.subscription.id = ?1 and size(se.tags) = 0 and se.seen = true and fe.createdAt < ?2" +
    "  and not exists (select 1 from SubscriptionEntry sub_se" +
    "   where (size(sub_se.tags) > 0 or sub_se.seen = false) and sub_se.feedEntry.id = se.feedEntry.id) " +
    " or se is null")
  Page<Long> findErasableEntryIdsBySubscriptionIdAndCreatedAtEarlierThanRetainDate(Long id, Date retainDate, Pageable pageable);
}
