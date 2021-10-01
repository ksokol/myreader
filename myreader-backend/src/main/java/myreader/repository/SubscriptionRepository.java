package myreader.repository;

import myreader.entity.Subscription;
import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;

public interface SubscriptionRepository extends CrudRepository<Subscription, Long> {

  Optional<Subscription> findByUrl(String url);

  @Transactional
  @Query("update subscription set accepted_fetch_count = accepted_fetch_count + 1 where id = :id")
  @Modifying
  void incrementFetchCount(@Param("id") Long id);

  @Query("select distinct tag from subscription where tag is not null")
  Set<String> findDistinctTags();
}
