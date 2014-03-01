package myreader.repository;

import myreader.entity.Feed;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
public interface FeedRepository extends PagingAndSortingRepository<Feed, Long> {

    Feed findByUrl(String url);

    @Query("select count(f) from Feed f join f.entries fe where f.id = :id")
    Long countByFeedEntry(Long id);
}
