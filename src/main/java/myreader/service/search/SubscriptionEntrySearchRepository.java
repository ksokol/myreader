package myreader.service.search;

import static org.springframework.data.solr.core.query.Query.Operator.OR;

import java.util.List;

import myreader.entity.SearchableSubscriptionEntry;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.solr.repository.Query;
import org.springframework.data.solr.repository.SolrCrudRepository;
import org.springframework.stereotype.Repository;

/**
 * @author Kamill Sokol
 */
@Repository
public interface SubscriptionEntrySearchRepository extends SolrCrudRepository<SearchableSubscriptionEntry, Long>, SubscriptionEntrySearchRepositoryCustom {

	@Query(value = "?0", filters = "owner_id:?1", defaultOperator = OR)
	Slice<SearchableSubscriptionEntry> searchAndFilterByUser(String q, Long userId, Pageable pageable);

	@Query(value = "?0", filters = {"feed_id:?1", "owner_id:?2"}, defaultOperator = OR)
    Slice<SearchableSubscriptionEntry> searchAndFilterByUserAndSubscription(String q, Long id, Long userId, Pageable pageable);

    @Query(value = "?0", filters = {"feed_id:?1", "owner_id:?2", "seen:false"}, defaultOperator = OR)
    Slice<SearchableSubscriptionEntry> searchForNewAndFilterByUserAndSubscription(String q, Long id, Long userId, Pageable pageable);

    @Query(value = "?0", filters = {"feed_id:(?1)", "owner_id:?2"}, defaultOperator = OR)
    Slice<SearchableSubscriptionEntry> searchAndFilterByUserAndSubscriptions(String q, List<Long> subscriptionIds, Long userId, Pageable pageable);

    @Query(value = "?0", filters = {"feed_id:(?1)", "owner_id:?2", "seen:false"}, defaultOperator = OR)
    Slice<SearchableSubscriptionEntry> searchNewByAndFilterByUserAndSubscriptions(String q, List<Long> subscriptionIds, Long userId, Pageable pageable);

    @Query(value = "ft_tags:?0", filters = {"owner_id:?1"})
    Slice<SearchableSubscriptionEntry> findByTagAndUser(String tag, long userId, Pageable pageable);
}
