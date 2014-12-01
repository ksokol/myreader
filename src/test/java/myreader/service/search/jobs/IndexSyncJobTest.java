package myreader.service.search.jobs;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.junit.Assert.assertThat;

import java.util.List;

import myreader.entity.SearchableSubscriptionEntry;
import myreader.entity.SubscriptionEntry;
import myreader.repository.SubscriptionEntryRepository;
import myreader.service.search.SubscriptionEntrySearchRepository;
import myreader.test.IntegrationTestSupport;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.solr.core.SolrOperations;
import org.springframework.data.solr.core.query.SimpleQuery;

/**
 * @author Kamill Sokol
 */
public class IndexSyncJobTest extends IntegrationTestSupport {

	@Autowired
	private IndexSyncJob indexSyncJob;
	@Autowired
	private SubscriptionEntryRepository subscriptionEntryRepository;
	@Autowired
	private SubscriptionEntrySearchRepository subscriptionEntrySearchRepository;
	@Autowired
	private SolrOperations solrOperations;

	public void beforeTest() {
        solrOperations.delete(new SimpleQuery("*:*"));
        solrOperations.commit();
		assertThat(allSearchEntries().getNumberOfElements(), is(0));
        indexSyncJob.run();
	}

	@Test
	public void testReindexAllSubscriptionEntries() {
		Page<SearchableSubscriptionEntry> searchEntries = allSearchEntries();
		assertThat(searchEntries.getContent().size(), is(not(0)));

		List<SubscriptionEntry> entries = subscriptionEntryRepository.findAll();
		assertThat(entries.size(), is(searchEntries.getSize()));
	}

	@Test
	public void testReindexAllSubscriptionEntriesDifferentPageSize() {
		assertThat(allSearchEntries().getContent().size(), is(13));

		addSubscriptionEntry();
		addSubscriptionEntry();
		addSubscriptionEntry();

		indexSyncJob.setPageSize(5);
		indexSyncJob.run();
		solrOperations.commit();

		assertThat(allSearchEntries().getContent().size(), is(16));
	}

	@Test
	public void testAllSubscriptionEntryPropertiesSet() {
		SearchableSubscriptionEntry searchEntry = subscriptionEntrySearchRepository.findOne(1001L);
		SubscriptionEntry entry = subscriptionEntryRepository.findOne(1001L);

		assertThat(searchEntry.getId(), is(entry.getId()));
		assertThat(searchEntry.getCreatedAt().getTime(), is(entry.getCreatedAt().getTime()));
		assertThat(searchEntry.getSubscriptionTitle(), is(entry.getSubscription().getTitle()));
		assertThat(searchEntry.getUrl(), is(entry.getFeedEntry().getUrl()));
		assertThat(searchEntry.getContent(), is(entry.getFeedEntry().getContent()));
		assertThat(searchEntry.getOwnerId(), is(entry.getSubscription().getUser().getId()));
		assertThat(searchEntry.getOwner(), is(entry.getSubscription().getUser().getEmail()));
		assertThat(searchEntry.getSubscriptionId(), is(entry.getSubscription().getId()));
		assertThat(searchEntry.getTag(), is(entry.getTag()));
		assertThat(searchEntry.getTitle(), is(entry.getFeedEntry().getTitle()));
	}

	private Page<SearchableSubscriptionEntry> allSearchEntries() {
		return (Page<SearchableSubscriptionEntry>) subscriptionEntrySearchRepository.findAll();
	}

	private void addSubscriptionEntry() {
		SubscriptionEntry one = subscriptionEntryRepository.findOne(1001L);
		SubscriptionEntry subscriptionEntry = new SubscriptionEntry();
		subscriptionEntry.setFeedEntry(one.getFeedEntry());
		subscriptionEntry.setSubscription(one.getSubscription());
		subscriptionEntryRepository.save(subscriptionEntry);
	}
}
