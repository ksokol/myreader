package myreader.repository;

import myreader.entity.Feed;
import myreader.entity.FeedEntry;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import java.util.Date;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
public interface FeedEntryRepository extends PagingAndSortingRepository<FeedEntry, Long> {

    @Query("select count(*) from FeedEntry where title = ?1 or guid = ?2 or url = ?3")
    int countByTitleOrGuidOrUrl(String title, String guid, String url);

    @Query("from FeedEntry where feed = ?1 and createdAt < ?2")
    Iterable<FeedEntry> findByFeedAfterCreatedAt(Feed feed, Date createdAt);

    @Query("select count(*) from FeedEntry where feed = ?1 and createdAt < ?2")
    int countByFeedAfterCreatedAt(Feed feed, Date createdAt);
}
