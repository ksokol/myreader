package myreader.service.search;

import myreader.entity.SearchableSubscriptionEntry;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.solr.repository.Query;
import org.springframework.data.solr.repository.SolrCrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import static org.springframework.data.solr.core.query.Query.Operator.OR;

/**
 * @author Kamill Sokol
 */
@Repository
public interface SubscriptionEntrySearchRepository extends SolrCrudRepository<SearchableSubscriptionEntry, Long>, SubscriptionEntrySearchRepositoryCustom {

	@Query(value = "?0", filters = {"owner_id:?1", "id:[* TO ?2]"}, defaultOperator = OR)
	Slice<SearchableSubscriptionEntry> searchAndFilterByUser(String q, Long userId, Long nextId, Pageable pageable);

	@Query(value = "?0", filters = {"feed_id:?1", "owner_id:?2", "id:[* TO ?3]"}, defaultOperator = OR)
    Slice<SearchableSubscriptionEntry> searchAndFilterByUserAndSubscription(String q, Long id, Long userId, Long nextId, Pageable pageable);

    @Query(value = "?0", filters = {"feed_id:?1", "owner_id:?2", "seen:false", "id:[* TO ?3]"}, defaultOperator = OR)
    Slice<SearchableSubscriptionEntry> searchForNewAndFilterByUserAndSubscription(String q, Long id, Long userId, Long nextId, Pageable pageable);

    @Query(value = "?0", filters = {"feed_id:(?1)", "owner_id:?2"}, defaultOperator = OR)
    Slice<SearchableSubscriptionEntry> searchAndFilterByUserAndSubscriptions(String q, List<Long> subscriptionIds, Long userId, Pageable pageable);

    @Query(value = "?0", filters = {"feed_id:(?1)", "owner_id:?2", "seen:false"}, defaultOperator = OR)
    Slice<SearchableSubscriptionEntry> searchNewByAndFilterByUserAndSubscriptions(String q, List<Long> subscriptionIds, Long userId, Pageable pageable);

    @Query(value = "?0", filters = {"tag:*", "owner_id:?1", "id:[* TO ?2]"}, defaultOperator = OR)
    Slice<SearchableSubscriptionEntry> searchAllTagsAndUser(String q, long userId, Long nextId, Pageable pageable);

    @Query(value = "*", filters = {"ft_tags:?0", "owner_id:?1", "id:[* TO ?2]"})
    Slice<SearchableSubscriptionEntry> findByTagAndUser(String tag, long userId, Long nextId, Pageable pageable);

    @Query(value = "?0", filters = {"ft_tags:?1", "owner_id:?2", "id:[* TO ?3]"}, defaultOperator = OR)
    Slice<SearchableSubscriptionEntry> searchByTagAndUser(String q, String tag, long userId, Long nextId, Pageable pageable);

    @Query(value = "*", filters = {"ft_tags:*", "owner_id:?0", "id:[* TO ?1]"})
    Slice<SearchableSubscriptionEntry> findAllTagsAndUser(Long id, Long nextId, Pageable pageable);
}
