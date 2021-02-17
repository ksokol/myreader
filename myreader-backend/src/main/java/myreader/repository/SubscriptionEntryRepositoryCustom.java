package myreader.repository;

import myreader.entity.SubscriptionEntry;
import org.springframework.data.domain.Slice;

import java.util.Set;

public interface SubscriptionEntryRepositoryCustom {

  Slice<SubscriptionEntry> findBy(
    String feedId,
    String feedTagEqual,
    String entryTagEqual,
    Boolean seen,
    Long next
  );

  Set<String> findDistinctTags();

}
