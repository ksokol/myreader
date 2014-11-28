package myreader.repository;

import myreader.entity.SearchableSubscriptionEntry;
import myreader.entity.SubscriptionEntry;
import myreader.service.search.SubscriptionEntrySearchRepository;
import myreader.test.IntegrationTestSupport;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;

/**
 * @author Kamill Sokol
 */
public class SubscriptionEntryRepositoryImplTest extends IntegrationTestSupport {

    private static final long ID = 1001L;

    @Autowired
    private SubscriptionEntryRepository subscriptionEntryRepository;
    @Autowired
    private SubscriptionEntrySearchRepository subscriptionEntrySearchRepository;

    @Test
    public void testDelete() {
        SubscriptionEntry beforeRepository = subscriptionEntryRepository.findOne(ID);
        SearchableSubscriptionEntry beforeSearch = subscriptionEntrySearchRepository.findOne(ID);

        assertThat(beforeRepository, notNullValue());
        assertThat(beforeSearch, notNullValue());

        subscriptionEntryRepository.delete(beforeRepository);

        SubscriptionEntry afterRepository = subscriptionEntryRepository.findOne(ID);
        SearchableSubscriptionEntry afterSearch = subscriptionEntrySearchRepository.findOne(ID);

        assertThat(afterRepository, nullValue());
        assertThat(afterSearch, nullValue());
    }

    @Test
    public void testDeleteUnknownId()  {
        subscriptionEntryRepository.delete(42L);
    }
}