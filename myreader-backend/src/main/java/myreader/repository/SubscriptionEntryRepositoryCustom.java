package myreader.repository;

import myreader.entity.SubscriptionEntry;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

import java.util.Set;

/**
 * @author Kamill Sokol
 */
public interface SubscriptionEntryRepositoryCustom {

    Slice<SubscriptionEntry> findBy(String q, Long ownerId, String feedId, String feedTagEqual, String entryTagEqual, String seen, Long nextId, Pageable pageable);

    Set<String> findDistinctTags(Long userId);
}