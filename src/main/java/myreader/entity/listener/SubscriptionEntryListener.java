package myreader.entity.listener;

import myreader.entity.SearchableSubscriptionEntry;
import myreader.entity.SubscriptionEntry;

import javax.persistence.PostPersist;
import javax.persistence.PostRemove;
import javax.persistence.PostUpdate;
import javax.persistence.PreRemove;

/**
 * @author Kamill Sokol
 */
public class SubscriptionEntryListener extends ContextAwareEntityListener {

    @PostUpdate
	@PostPersist
	public void postPersist(SubscriptionEntry subscriptionEntry) {
		SearchableSubscriptionEntry converted = getConversionService().convert(subscriptionEntry, SearchableSubscriptionEntry.class);
		getSubscriptionEntrySearchRepository().save(converted);
	}

    @PostRemove
    public void postRemove(SubscriptionEntry subscriptionEntry) {
        getSubscriptionEntrySearchRepository().delete(subscriptionEntry.getId());
    }

}
