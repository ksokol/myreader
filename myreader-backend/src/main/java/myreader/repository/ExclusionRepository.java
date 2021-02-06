package myreader.repository;

import myreader.entity.ExclusionPattern;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface ExclusionRepository extends PagingAndSortingRepository<ExclusionPattern, Long> {

  @Query("select ep from ExclusionPattern ep join fetch ep.subscription where ep.id = ?1 and ep.subscription.id = ?2")
  Optional<ExclusionPattern> findByIdAndSubscriptionId(Long id, Long subscriptionId);

  @Query("select ep from ExclusionPattern ep join fetch ep.subscription where ep.subscription.id = ?1 and ep.pattern = ?2")
  ExclusionPattern findBySubscriptionIdAndPattern(Long subscriptionId, String pattern);

  @Query("select ep from ExclusionPattern ep join fetch ep.subscription where ep.subscription.id = ?1")
  List<ExclusionPattern> findBySubscriptionId(Long subscriptionId);

  @Transactional
  @Query("update ExclusionPattern set hitCount = hitCount +1 where id = ?1")
  @Modifying
  void incrementHitCount(Long exclusionPatternId);
}
