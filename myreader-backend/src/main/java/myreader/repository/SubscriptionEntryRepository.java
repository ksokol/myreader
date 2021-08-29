package myreader.repository;

import myreader.entity.SubscriptionEntry;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

public interface SubscriptionEntryRepository extends CrudRepository<SubscriptionEntry, Long>, SubscriptionEntryRepositoryCustom {

  @Query("select * from subscription_entry where id = :id")
  @Override
  Optional<SubscriptionEntry> findById(@Param("id") Long id);

  @Query("select count(*) from subscription_entry where (title = :title or guid = :guid or url = :url) and subscription_id = :subscriptionId")
  int countByTitleOrGuidOrUrlAndSubscriptionId(
    @Param("title") String title,
    @Param("guid") String guid,
    @Param("url") String url,
    @Param("subscriptionId") Long subscriptionId
  );

  long countBySubscriptionId(Long subscriptionId);

  @Query("select * from subscription_entry where subscription_id = :subscriptionId order by created_at desc limit :limit")
  List<SubscriptionEntry> findAllBySubscriptionIdOrderByCreatedAtDesc(@Param("subscriptionId") Long subscriptionId, @Param("limit") int limit);

  @Query("select id from subscription_entry where subscription_id = :subscriptionId and tags is null and seen = true and created_at < :retainDate")
  List<Long> findAllIdsBySubscriptionIdAndTagsIsEmptyAndCreatedAtIsLowerThan(@Param("subscriptionId") Long id, @Param("retainDate") OffsetDateTime retainDate);

  @Query("select count(*) from subscription_entry where subscription_id = :id and seen = false and excluded = false")
  long countUnseenBySubscriptionId(@Param("id") Long subscriptionId);
}
