package myreader.repository;

import myreader.entity.FetchError;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;

/**
 * @author Kamill Sokol
 */
public interface FetchErrorRepository extends JpaRepository<FetchError, Long> {

    @Modifying
    @Query("delete from FetchError where createdAt < ?1")
    int retainFetchErrorBefore(Date retainDate);

    Page<FetchError> findByFeedIdOrderByCreatedAtDesc(Long feedId, Pageable pageable);

    int countByFeedIdAndCreatedAtGreaterThan(Long feedId, Date createdAt);
}
