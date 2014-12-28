package myreader.repository;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;

import myreader.entity.SearchableSubscriptionEntry;
import myreader.entity.SubscriptionEntry;
import myreader.service.search.SubscriptionEntrySearchRepository;

import org.springframework.core.convert.ConversionService;
import org.springframework.util.Assert;

/**
* @author Kamill Sokol
*/
public class SubscriptionEntryRepositoryImpl {

    private final EntityManager em;
    private final ConversionService conversionService;
    private final SubscriptionEntrySearchRepository subscriptionEntrySearchRepository;

    public SubscriptionEntryRepositoryImpl(final EntityManager em, final ConversionService conversionService, final SubscriptionEntrySearchRepository subscriptionEntrySearchRepository) {
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

    public List<SubscriptionEntry> save(Iterable<SubscriptionEntry> entities) {
        List<SubscriptionEntry> result = new ArrayList<>();
        if (entities == null) {
            return result;
        }
        for (SubscriptionEntry entity : entities) {
            result.add(save(entity));
        }
        return result;
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
