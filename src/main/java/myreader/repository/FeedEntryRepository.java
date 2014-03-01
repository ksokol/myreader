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

    @Query("select count(*) from FeedEntry where title = :title or guid = :guid or url = :url")
    int countByTitleOrGuidOrUrl(@Param("title") String title,@Param("guid") String guid,@Param("url") String url);

    @Query("from FeedEntry where feed = ?0 and createdAt < ?1")
    Iterable<FeedEntry> findByFeedAfterCreatedAt(Feed feed, Date createdAt);

    @Query("select count(*) from FeedEntry where feed = ?0 and createdAt < ?1")
    int countByFeedAfterCreatedAt(Feed feed, Date createdAt);
}
