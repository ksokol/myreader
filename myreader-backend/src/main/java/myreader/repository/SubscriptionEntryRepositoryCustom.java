package myreader.repository;

import myreader.entity.SubscriptionEntry;
import org.springframework.data.domain.Slice;

public interface SubscriptionEntryRepositoryCustom {

  Slice<SubscriptionEntry> findBy(String feedId, String feedTagEqual, Boolean seen, Long next);
}
