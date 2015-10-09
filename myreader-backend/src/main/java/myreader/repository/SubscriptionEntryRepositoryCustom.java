package myreader.repository;

import myreader.entity.SubscriptionEntry;
import org.springframework.data.domain.Slice;

import java.util.Map;
import java.util.Set;

/**
 * @author Kamill Sokol
 */
public interface SubscriptionEntryRepositoryCustom {

    Slice<SubscriptionEntry> findBy(Map<String, Object> params, Long ownerId);

    Set<String> findDistinctTags(Long userId);
}
