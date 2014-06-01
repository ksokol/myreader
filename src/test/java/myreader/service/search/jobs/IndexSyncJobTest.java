package myreader.service.search.jobs;

import myreader.entity.SearchableSubscriptionEntry;
import myreader.entity.SubscriptionEntry;
import myreader.repository.SubscriptionEntryRepository;
import myreader.service.search.SubscriptionEntrySearchRepository;
import myreader.test.IntegrationTestSupport;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.solr.core.SolrTemplate;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.junit.Assert.assertThat;

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
	@PersistenceContext
	private EntityManager em;
	@Autowired
	private SolrTemplate solrTemplate;

	public void beforeTest() {
		assertThat(allSearchEntries().getNumberOfElements(), is(0));
	}

	@Test
	public void testReindexAllSubscriptionEntries() {
		indexSyncJob.run();
		solrTemplate.commit();

		Page<SearchableSubscriptionEntry> searchEntries = allSearchEntries();
		assertThat(searchEntries.getContent().size(), is(not(0)));

		List<SubscriptionEntry> entries = subscriptionEntryRepository.findAll();
		assertThat(entries.size(), is(searchEntries.getSize()));
	}

	@Test
	public void testReindexAllSubscriptionEntriesDifferentPageSize() {
		indexSyncJob.run();
		solrTemplate.commit();

		assertThat(allSearchEntries().getContent().size(), is(8));

		addSubscriptionEntry();
		addSubscriptionEntry();
		addSubscriptionEntry();

		indexSyncJob.setPageSize(5);
		indexSyncJob.run();
		solrTemplate.commit();

		assertThat(allSearchEntries().getContent().size(), is(11));
	}

	@Test
	public void testAllSubscriptionEntryPropertiesSet() {
		indexSyncJob.run();
		solrTemplate.commit();

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
		em.flush();
	}
}
