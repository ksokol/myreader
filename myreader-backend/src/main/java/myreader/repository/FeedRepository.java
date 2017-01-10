package myreader.repository;

import myreader.entity.Feed;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;
import java.util.List;

/**
 * @author Kamill Sokol
 */
public interface FeedRepository extends JpaRepository<Feed, Long> {

    Feed findByUrl(String url);

    Page<Feed> findByUrlIn(Collection<String> url, Pageable pageable);

    @Query("select count(s.id) from Subscription s where s.feed.id = ?1")
    int countSubscriptionsByFeedId(Long id);

    @Query("select f from Feed f where f.id not in (select s.feed.id from Subscription s where s.feed.id = f.id)")
    List<Feed> findByZeroSubscriptions();
}
