package myreader.repository;

import myreader.entity.SearchableSubscriptionEntry;
import myreader.entity.SubscriptionEntry;
import myreader.service.search.SubscriptionEntrySearchRepository;
import org.springframework.core.convert.ConversionService;
import org.springframework.util.Assert;

import javax.persistence.EntityManager;

/**
* @author Kamill Sokol
*/
public class SubscriptionEntryRepositoryImpl {

    private final EntityManager em;
    private final ConversionService conversionService;
    private final SubscriptionEntrySearchRepository subscriptionEntrySearchRepository;

    public SubscriptionEntryRepositoryImpl(EntityManager em, ConversionService conversionService, SubscriptionEntrySearchRepository subscriptionEntrySearchRepository) {
        Assert.notNull(em);
        Assert.notNull(conversionService);
        Assert.notNull(subscriptionEntrySearchRepository);
        this.em = em;
        this.conversionService = conversionService;
        this.subscriptionEntrySearchRepository = subscriptionEntrySearchRepository;
    }

    public SubscriptionEntry save(SubscriptionEntry subscriptionEntry) {
        Assert.notNull(subscriptionEntry, "Cannot delete entity null");

        if(subscriptionEntry.getId() == null) {
            em.persist(subscriptionEntry);
        } else {
            subscriptionEntry = em.merge(subscriptionEntry);
        }

        SearchableSubscriptionEntry convert = conversionService.convert(subscriptionEntry, SearchableSubscriptionEntry.class);
        subscriptionEntrySearchRepository.save(convert);
        return subscriptionEntry;
    }

    public void delete(Long id) {
        Assert.notNull(id, "Cannot delete entity null");
        SubscriptionEntry subscriptionEntry = em.find(SubscriptionEntry.class, id);
        if(subscriptionEntry == null) {
            return;
        }
        em.remove(subscriptionEntry);
        subscriptionEntrySearchRepository.delete(id);
    }

    public void delete(SubscriptionEntry subscriptionEntry) {
        Assert.notNull(subscriptionEntry, "Cannot delete entity null");
        delete(subscriptionEntry.getId());
    }
}
