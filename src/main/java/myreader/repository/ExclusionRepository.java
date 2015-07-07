package myreader.repository;

import myreader.entity.ExclusionPattern;
import myreader.entity.ExclusionSet;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

/**
 * @author Kamill Sokol
 */
public interface ExclusionRepository extends PagingAndSortingRepository<ExclusionPattern, Long> {

    @Query("select new myreader.entity.ExclusionSet(count(ep.id), sum(coalesce(ep.hitCount, 0)), s.id) from Subscription s left join s.exclusions ep where s.id = ?1 and s.user.id = ?2 group by s")
    ExclusionSet findSetByUser(Long subscriptionId, Long userId);

    @Query("select new myreader.entity.ExclusionSet(count(ep.id), sum(coalesce(ep.hitCount, 0)), s.id) from Subscription s left join s.exclusions ep where s.user.id = ?1 group by s")
    Page<ExclusionSet> findAllSetsByUser(Long userId, Pageable pageable);

    @Query(value = "select ep from ExclusionPattern ep join fetch ep.subscription where ep.subscription.id = ?1", countQuery = "select count(ep) from ExclusionPattern ep where ep.subscription.id = ?1")
    Page<ExclusionPattern> findBySubscriptionId(Long id, Pageable pageable);

    @Query("select ep from ExclusionPattern ep join fetch ep.subscription where ep.id = ?1 and ep.subscription.id = ?2 and ep.subscription.user.id = ?3")
    ExclusionPattern findByIdAndSubscriptionIdAndUserId(Long id, Long subscriptionId, Long userId);

    @Query("select ep from ExclusionPattern ep join fetch ep.subscription where ep.subscription.id = ?1 and ep.pattern = ?2")
    ExclusionPattern findBySubscriptionIdAndPattern(Long subscriptionId, String pattern);
}
