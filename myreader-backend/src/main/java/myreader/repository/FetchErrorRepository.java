package myreader.repository;

import myreader.entity.FetchError;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

public interface FetchErrorRepository extends JpaRepository<FetchError, Long> {

  @Transactional
  @Modifying
  @Query("delete from FetchError where createdAt < ?1")
  int retainFetchErrorBefore(Date retainDate);

  List<FetchError> findAllBySubscriptionIdOrderByCreatedAtDesc(Long subscriptionId);
}
