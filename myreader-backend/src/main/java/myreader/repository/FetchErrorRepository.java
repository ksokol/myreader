package myreader.repository;

import myreader.entity.FetchError;
import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

public interface FetchErrorRepository extends CrudRepository<FetchError, Long> {

  @Transactional
  @Modifying
  @Query("delete from fetch_error where created_at < :date")
  int retainFetchErrorBefore(@Param("date") Date retainDate);

  @Query("select * from fetch_error where subscription_id = :id order by created_at desc")
  List<FetchError> findAllBySubscriptionIdOrderByCreatedAtDesc(@Param("id") Long subscriptionId);
}
