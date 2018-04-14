package myreader.repository;

import myreader.entity.FeedEntry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Date;

/**
 * @author Kamill Sokol
 */
public interface FeedEntryRepository extends PagingAndSortingRepository<FeedEntry, Long> {

    @Query("select count(fe) from FeedEntry fe where (fe.title = ?1 or fe.guid = ?2 or fe.url = ?3) and fe.feed.id = ?4")
    int countByTitleOrGuidOrUrlAndFeedId(String title, String guid, String url, Long feedId);

    @Query("select fe from FeedEntry fe where fe.feed.id = ?1")
    Page<FeedEntry> findByFeedId(Long id, Pageable pageable);

    @Query(value="select fe from FeedEntry fe where fe.id > ?1 and fe.feed.id = ?2 order by fe.id asc")
    Slice<FeedEntry> findByGreaterThanFeedEntryId(Long feedEntry, Long feedId, Pageable pageable);

    long countByFeedId(Long feedId);

    Page<FeedEntry> findByFeedIdOrderByCreatedAtDesc(Long feedId, Pageable pageable);

    @Query("select distinct fe.id from FeedEntry fe left join fe.subscriptionEntries se " +
           " where fe.feed.id = ?1 and se.tag is null and se.seen = true and fe.createdAt < ?2" +
           "  and not exists (select 1 from SubscriptionEntry sub_se " +
           "   where (sub_se.tag is not null or sub_se.seen = false) and sub_se.feedEntry.id = se.feedEntry.id) " +
           " or se is null")
    Page<Long> findErasableEntryIdsByFeedIdAndCreatedAtEarlierThanRetainDate(Long id, Date retainDate, Pageable pageable);
}
