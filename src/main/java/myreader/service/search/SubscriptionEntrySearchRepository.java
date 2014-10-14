package myreader.service.search;

import static org.springframework.data.solr.core.query.Query.Operator.OR;

import java.util.List;

import myreader.entity.SearchableSubscriptionEntry;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.solr.repository.Query;
import org.springframework.data.solr.repository.SolrCrudRepository;
import org.springframework.stereotype.Repository;

/**
 * @author Kamill Sokol
 */
@Repository
public interface SubscriptionEntrySearchRepository extends SolrCrudRepository<SearchableSubscriptionEntry, Long> {

	@Query(value = "?0", filters = "owner_id:?1", defaultOperator = OR)
	Slice<SearchableSubscriptionEntry> searchAndFilterByUser(String q, Long userId, Pageable pageable);

	@Query(value = "?0", filters = {"feed_id:?1", "owner_id:?2"}, defaultOperator = OR)
	Page<SearchableSubscriptionEntry> searchAndFilterByUserAndSubscription(String q, Long id, Long userId, Pageable pageable);

    @Query(value = "?0", filters = {"feed_id:(?1)", "owner_id:?2"}, defaultOperator = OR)
    Slice<SearchableSubscriptionEntry> searchAndFilterByUserAndSubscriptions(String q, List<Long> subscriptionIds, Long userId, Pageable pageable);

}
