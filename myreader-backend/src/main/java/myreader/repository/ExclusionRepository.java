package myreader.repository;

import myreader.entity.ExclusionPattern;
import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface ExclusionRepository extends PagingAndSortingRepository<ExclusionPattern, Long> {

  @Query("select * from exclusion_pattern where id = :id and subscription_id = :subscriptionId")
  Optional<ExclusionPattern> findByIdAndSubscriptionId(@Param("id") Long id, @Param("subscriptionId") Long subscriptionId);

  @Query("select * from exclusion_pattern where subscription_id = :subscriptionId and pattern = :pattern")
  ExclusionPattern findBySubscriptionIdAndPattern(@Param("subscriptionId") Long subscriptionId, @Param("pattern") String pattern);

  @Query("select * from exclusion_pattern where subscription_id = :subscriptionId")
  List<ExclusionPattern> findBySubscriptionId(@Param("subscriptionId") Long subscriptionId);

  @Transactional
  @Query("update exclusion_pattern set hit_count = hit_count + 1 where id = :id")
  @Modifying
  void incrementHitCount(@Param("id") Long id);
}
