package myreader.repository;

import myreader.entity.FeedEntry;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

/**
 * @author Kamill Sokol
 */
public interface FeedEntryRepository extends PagingAndSortingRepository<FeedEntry, Long> {

    @Query("select count(fe) from FeedEntry fe where fe.title = ?1 or fe.guid = ?2 or fe.url = ?3")
    int countByTitleOrGuidOrUrl(String title, String guid, String url);

    @Query("select fe from FeedEntry fe where fe.feed.id = ?1")
    Page<FeedEntry> findByFeedId(Long id, Pageable pageable);
}