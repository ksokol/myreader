package myreader.repository;

import myreader.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

  @Query(value =
    "select s from Subscription s left join fetch s.subscriptionTag where " +
      "(select count(1) from SubscriptionEntry se where se.subscription.id = s.id and se.seen = false) > ?1 " +
      "order by s.createdAt desc"
  )
  List<Subscription> findAllByUnseenGreaterThan(long unseenCount);

  @Override
  @Query("select s from Subscription s left join fetch s.subscriptionTag where s.id = ?1")
  Optional<Subscription> findById(Long id);

  Optional<Subscription> findByUrl(String url);

  @Transactional
  @Query("update Subscription set fetchCount = fetchCount + 1 where id = ?1")
  @Modifying
  void incrementFetchCount(Long subscriptionId);
}
