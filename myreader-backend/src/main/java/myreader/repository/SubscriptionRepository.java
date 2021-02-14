package myreader.repository;

import myreader.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

  @Query(value =
    "select s from Subscription s where " +
      "(select count(1) from SubscriptionEntry se where se.subscription.id = s.id and se.seen = false) > ?1 " +
      "order by s.createdAt desc"
  )
  List<Subscription> findAllByUnseenGreaterThan(long unseenCount);

  Optional<Subscription> findByUrl(String url);

  @Transactional
  @Query("update Subscription set fetchCount = fetchCount + 1 where id = ?1")
  @Modifying
  void incrementFetchCount(Long subscriptionId);

  @Query("select distinct s.tag from Subscription s where s.tag is not null")
  Set<String> findDistinctTags();
}
