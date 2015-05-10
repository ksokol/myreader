package myreader.service.search;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.solr.repository.Query;
import org.springframework.data.solr.repository.SolrCrudRepository;

import myreader.entity.SearchableSubscriptionEntry;

/**
 * @author Kamill Sokol
 */
public interface SubscriptionEntrySearchRepository extends SolrCrudRepository<SearchableSubscriptionEntry, Long> {

    @Query(value = "?0", filters = {"owner_id:?1", "feed_id:?2", "feed_tags:?3", "seen:?4", "id:[* TO ?5]"})
    Slice<SearchableSubscriptionEntry> findBy(String q, Long ownerId, String feedId, String feedTagEqual, String seen, Long nextId, Pageable pageable);
}
