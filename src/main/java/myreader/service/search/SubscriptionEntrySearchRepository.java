package myreader.service.search;

import myreader.entity.SearchableSubscriptionEntry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.solr.repository.Query;
import org.springframework.data.solr.repository.SolrCrudRepository;
import org.springframework.stereotype.Repository;

/**
 * @author Kamill Sokol
 */
@Repository
public interface SubscriptionEntrySearchRepository extends SolrCrudRepository<SearchableSubscriptionEntry, Long> {

	@Query(value = "?0", filters = "owner_id:?1")
	Page<SearchableSubscriptionEntry> searchAndFilterByUser(String q, Long userId, Pageable pageable);

	@Query(value = "?0", filters = {"feed_id:?1", "owner_id:?2"})
	Page<SearchableSubscriptionEntry> searchAndFilterByUserAndSubscription(String q, Long id, Long userId, Pageable pageable);
}
