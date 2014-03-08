package myreader.service.subscriptionentry;

import myreader.entity.SubscriptionEntry;

import java.util.List;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
public interface SubscriptionEntryService {

    SubscriptionEntry findById(Long id);

    List<String> findDistinctTags();

    List<SubscriptionEntry> search(SubscriptionEntrySearchQuery search);

    void save(SubscriptionEntry subscriptionEntry);
}
