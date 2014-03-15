package myreader.repository;

import myreader.entity.Feed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
public interface FeedRepository extends JpaRepository<Feed, Long> {

    Feed findByUrl(String url);

    @Query("select count(f) from Feed f join f.entries fe where f.id = ?1")
    Long countByFeedEntry(Long id);
}
