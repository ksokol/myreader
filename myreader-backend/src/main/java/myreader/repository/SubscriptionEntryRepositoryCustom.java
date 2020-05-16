package myreader.repository;

import myreader.entity.SubscriptionEntry;
import org.springframework.data.domain.Slice;

import java.util.Set;

/**
 * @author Kamill Sokol
 */
public interface SubscriptionEntryRepositoryCustom {

    Slice<SubscriptionEntry> findBy(
            int size,
            String q,
            String feedId,
            String feedTagEqual,
            String entryTagEqual,
            String seen,
            Long next,
            long userId
    );

    Set<String> findDistinctTagsByUserId(long userId);
}
