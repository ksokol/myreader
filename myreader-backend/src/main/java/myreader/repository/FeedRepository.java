package myreader.repository;

import java.util.Collection;

import myreader.entity.Feed;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 * @author Kamill Sokol
 */
public interface FeedRepository extends JpaRepository<Feed, Long> {

    @Override
    Feed findOne(Long id);

    Feed findByUrl(String url);

    @Query("select f from Feed f where f.url in (?1)")
    Page<Feed> findAllByUrl(Collection<String> url, Pageable pageable);

    @Query("select count(s.id) from Subscription s where s.feed.id = ?1")
    int countSubscriptionsByFeedId(Long id);
}
