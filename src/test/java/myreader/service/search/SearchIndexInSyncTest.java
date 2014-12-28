package myreader.service.search;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;

import java.util.Arrays;
import java.util.List;

import myreader.entity.SearchableSubscriptionEntry;
import myreader.entity.SubscriptionEntry;
import myreader.repository.SubscriptionEntryRepository;
import myreader.test.IntegrationTestSupport;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.solr.core.SolrOperations;
import org.springframework.data.solr.core.query.SimpleQuery;

/**
 * @author Kamill Sokol
 */
public class SearchIndexInSyncTest extends IntegrationTestSupport {

	@Autowired
	private SubscriptionEntrySearchRepository subscriptionEntrySearchRepository;
	@Autowired
	private SubscriptionEntryRepository subscriptionEntryRepository;
    @Autowired
    private SolrOperations solrOperations;

    @Before
    public void setUp() {
        solrOperations.delete(new SimpleQuery("*:*"));
        solrOperations.commit();
        Page p = (Page) subscriptionEntrySearchRepository.findAll();
        assertThat(p.getTotalElements(), is(0L));
    }

	@Test
	public void testInsert() {
		SubscriptionEntry subscriptionEntry = newSubscriptionEntry();

		subscriptionEntryRepository.save(subscriptionEntry);

		Page<SearchableSubscriptionEntry> p1 = (Page) subscriptionEntrySearchRepository.findAll();
		assertThat(p1.getTotalElements(), is(1L));
        assertThat(p1.getContent().get(0).getId(), is(subscriptionEntry.getId()));
	}

    @Test
    public void testUpdate() {
        SubscriptionEntry subscriptionEntry = newSubscriptionEntry();
        subscriptionEntry.setSeen(true);

        subscriptionEntryRepository.save(subscriptionEntry);

        Page<SearchableSubscriptionEntry> p1 = (Page) subscriptionEntrySearchRepository.findAll();
        assertThat(p1.getTotalElements(), is(1L));
        assertThat(p1.getContent().get(0).isSeen(), is(true));

        subscriptionEntry.setSeen(false);

        subscriptionEntryRepository.save(subscriptionEntry);

        Page<SearchableSubscriptionEntry> p2 = (Page) subscriptionEntrySearchRepository.findAll();
        assertThat(p2.getTotalElements(), is(1L));
        assertThat(p2.getContent().get(0).isSeen(), is(false));
    }

    @Test
    public void testDelete() {
        SubscriptionEntry subscriptionEntry = newSubscriptionEntry();

        subscriptionEntryRepository.save(subscriptionEntry);

        Page<SearchableSubscriptionEntry> p1 = (Page) subscriptionEntrySearchRepository.findAll();
        assertThat(p1.getTotalElements(), is(1L));

        subscriptionEntryRepository.delete(subscriptionEntry.getId());

        Page<SearchableSubscriptionEntry> p2 = (Page) subscriptionEntrySearchRepository.findAll();
        assertThat(p2.getTotalElements(), is(0L));
    }

    @Test
    public void testSaveIterables() {
        List<SubscriptionEntry> subscriptionEntries = Arrays.asList(newSubscriptionEntry());
        List<SubscriptionEntry> saved = subscriptionEntryRepository.save(subscriptionEntries);
        SearchableSubscriptionEntry one = subscriptionEntrySearchRepository.findOne(saved.get(0).getId());
        Assert.assertThat(one, notNullValue());
    }

	private SubscriptionEntry newSubscriptionEntry() {
		SubscriptionEntry one = subscriptionEntryRepository.findOne(1001L);
		SubscriptionEntry subscriptionEntry = new SubscriptionEntry();
		subscriptionEntry.setFeedEntry(one.getFeedEntry());
		subscriptionEntry.setSubscription(one.getSubscription());
		return subscriptionEntry;
	}
}
