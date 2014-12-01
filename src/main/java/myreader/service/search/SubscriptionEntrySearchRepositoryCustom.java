package myreader.service.search;

import myreader.entity.SubscriptionEntryTagGroup;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * @author Kamill Sokol
 */
public interface SubscriptionEntrySearchRepositoryCustom {

    Page<SubscriptionEntryTagGroup> findDistinctTagsByUser(Long userId, Pageable pageable);
}
