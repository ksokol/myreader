package myreader.repository;

import myreader.entity.SubscriptionEntry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Set;

/**
 * @author Kamill Sokol
 */
public interface SubscriptionEntryRepositoryCustom {

    Page<SubscriptionEntry> findByForCurrentUser(
            Pageable pageRequest,
            String q,
            String feedId,
            String feedTagEqual,
            String entryTagEqual,
            String seen,
            Long stamp
    );

    Set<String> findDistinctTagsForCurrentUser();
}
