package myreader.repository;

import myreader.entity.Feed;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedRepository extends JpaRepository<Feed, Long> {

  Feed findByUrl(String url);

  List<Feed> findAllByOrderByCreatedAtDesc();
}
