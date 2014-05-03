package myreader.repository;

import myreader.entity.Feed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import javax.persistence.LockModeType;

/**
 * @author Kamill Sokol
 */
public interface FeedRepository extends JpaRepository<Feed, Long> {

    @Lock(LockModeType.PESSIMISTIC_READ)
    @Override
    Feed findOne(Long aLong);

    @Lock(LockModeType.PESSIMISTIC_READ)
    Feed findByUrl(String url);

    @Query("select count(f) from Feed f join f.entries fe where f.id = ?1")
    Long countByFeedEntry(Long id);
}
