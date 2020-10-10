package myreader.repository;

import myreader.entity.Feed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FeedRepository extends JpaRepository<Feed, Long> {

    Feed findByUrl(String url);

    @Query("select f from Feed f where f.id not in (select s.feed.id from Subscription s where s.feed.id = f.id)")
    List<Feed> findByZeroSubscriptions();

    List<Feed> findAllByOrderByCreatedAtDesc();
}
