package myreader.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

import myreader.entity.SubscriptionEntry;

/**
 * @author Kamill Sokol
 */
public interface SubscriptionEntryRepositoryCustom {

    Slice<SubscriptionEntry> findBy(String q, Long ownerId, String feedId, String feedTagEqual, String seen, Long nextId, Pageable pageable);
}
