package myreader.service.search.jobs;

import static org.hamcrest.Matchers.hasSize;
import static org.junit.Assert.assertThat;

import myreader.entity.SubscriptionEntry;
import myreader.repository.SubscriptionEntryRepository;
import myreader.test.IntegrationTestSupport;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

/**
 * @author Kamill Sokol
 */
//@Ignore
public class IndexSyncJobTest extends IntegrationTestSupport {

	@Autowired
	private IndexSyncJob indexSyncJob;
	@Autowired
	private SubscriptionEntryRepository subscriptionEntryRepository;

	@Test
	public void testReindexAllSubscriptionEntriesDifferentPageSize() {
		assertThat(allSearchEntries(), hasSize(13));

		addSubscriptionEntry();
		addSubscriptionEntry();
		addSubscriptionEntry();

		indexSyncJob.run();

		assertThat(allSearchEntries(), hasSize(16));
	}


	private List<SubscriptionEntry> allSearchEntries() {
		return subscriptionEntryRepository.findAll();
	}

	private void addSubscriptionEntry() {
		SubscriptionEntry one = subscriptionEntryRepository.findOne(1001L);
		SubscriptionEntry subscriptionEntry = new SubscriptionEntry();
		subscriptionEntry.setFeedEntry(one.getFeedEntry());
		subscriptionEntry.setSubscription(one.getSubscription());
		subscriptionEntryRepository.save(subscriptionEntry);
	}
}
