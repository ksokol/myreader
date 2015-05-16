package myreader.service.subscriptionentry;

import java.util.List;

import myreader.entity.SubscriptionEntry;

/**
 * @author Kamill Sokol
 */
public interface SubscriptionEntryService {

    SubscriptionEntry findById(Long id);

    List<String> findDistinctTags();

    void save(SubscriptionEntry subscriptionEntry);
}
