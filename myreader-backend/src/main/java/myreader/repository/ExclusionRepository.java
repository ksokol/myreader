package myreader.repository;

import myreader.entity.ExclusionPattern;
import myreader.entity.ExclusionSet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * @author Kamill Sokol
 */
public interface ExclusionRepository extends PagingAndSortingRepository<ExclusionPattern, Long> {

    @Query("select new myreader.entity.ExclusionSet(count(ep.id), sum(coalesce(ep.hitCount, 0)), s.id) from Subscription s left join s.exclusions ep where s.id = ?1 and s.user.id = ?#{principal.id} group by s")
    ExclusionSet findSetByCurrentUser(Long subscriptionId);

    @Query("select new myreader.entity.ExclusionSet(count(ep.id), sum(coalesce(ep.hitCount, 0)), s.id) from Subscription s left join s.exclusions ep where s.user.id = ?#{principal.id} group by s")
    Page<ExclusionSet> findAllSetsByUser(Pageable pageable);

    @Query(value = "select ep from ExclusionPattern ep join fetch ep.subscription where ep.subscription.id = ?1", countQuery = "select count(ep) from ExclusionPattern ep where ep.subscription.id = ?1")
    Page<ExclusionPattern> findBySubscriptionId(Long id, Pageable pageable);

    @Query("select ep from ExclusionPattern ep join fetch ep.subscription where ep.id = ?1 and ep.subscription.id = ?2 and ep.subscription.user.id = ?#{principal.id}")
    ExclusionPattern findByIdAndSubscriptionIdAndCurrentUser(Long id, Long subscriptionId);

    @Query("select ep from ExclusionPattern ep join fetch ep.subscription where ep.subscription.id = ?1 and ep.pattern = ?2")
    ExclusionPattern findBySubscriptionIdAndPattern(Long subscriptionId, String pattern);

    @Query("select ep from ExclusionPattern ep join fetch ep.subscription where ep.subscription.id = ?1")
    List<ExclusionPattern> findBySubscriptionId(Long subscriptionId);

    @Transactional
    @Query("update ExclusionPattern set hitCount = hitCount +1 where id = ?1")
    @Modifying
    void incrementHitCount(Long exclusionPatternId);
}
