package myreader.repository;

import myreader.entity.Subscription;
import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface SubscriptionRepository extends CrudRepository<Subscription, Long> {

  @Query(value =
    "select s.* from subscription s where " +
      "(select count(1) from subscription_entry se where se.subscription_id = s.id and se.seen = false) > :unseenCount " +
      "order by s.created_at desc"
  )
  List<Subscription> findAllByUnseenGreaterThan(@Param("unseenCount") long unseenCount);

  Optional<Subscription> findByUrl(String url);

  @Transactional
  @Query("update subscription set accepted_fetch_count = accepted_fetch_count + 1 where id = :id")
  @Modifying
  void incrementFetchCount(@Param("id") Long id);

  @Query("select distinct tag from subscription where tag is not null")
  Set<String> findDistinctTags();
}
