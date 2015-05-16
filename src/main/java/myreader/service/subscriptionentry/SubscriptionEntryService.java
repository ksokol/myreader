package myreader.service.subscriptionentry;

import myreader.entity.SubscriptionEntry;

/**
 * @author Kamill Sokol
 */
public interface SubscriptionEntryService {

    SubscriptionEntry findById(Long id);

    void save(SubscriptionEntry subscriptionEntry);
}
