package myreader.repository;

import myreader.entity.SubscriptionEntry;
import org.springframework.data.domain.Slice;

import java.util.Set;

/**
 * @author Kamill Sokol
 */
public interface SubscriptionEntryRepositoryCustom {

    Slice<SubscriptionEntry> findByForCurrentUser(String q, String feedId, String feedTagEqual, String entryTagEqual, String seen, Long nextId, int pageSize);

    Set<String> findDistinctTagsForCurrentUser();
}
