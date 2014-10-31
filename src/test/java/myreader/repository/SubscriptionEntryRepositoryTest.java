package myreader.repository;

import static myreader.hamcrest.Matchers.isInDescendingOrdering;
import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.hasSize;
import static org.junit.Assert.assertThat;
import static org.junit.Assume.assumeThat;

import java.util.List;

import myreader.entity.FeedEntry;
import myreader.entity.Identifiable;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.test.IntegrationTestSupport;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

public class SubscriptionEntryRepositoryTest extends IntegrationTestSupport {

    private static final Pageable DEFAULT_PAGE = new PageRequest(0, 10);

    @Autowired
    private SubscriptionEntryRepository subscriptionEntryRepository;
    @Autowired
    private SubscriptionRepository subscriptionRepository;
    @Autowired
    private FeedEntryRepository feedEntryRepository;

    public void beforeTest() {
        Subscription subscription = subscriptionRepository.findOne(1L);
        FeedEntry feedEntry = feedEntryRepository.findOne(1001L);

        for (int i = 0; i < 3; i++) {
            SubscriptionEntry subscriptionEntry = new SubscriptionEntry();
            subscriptionEntry.setSubscription(subscription);
            subscriptionEntry.setFeedEntry(feedEntry);

            subscriptionEntryRepository.save(subscriptionEntry);
        }
    }

    @Test
    public void testFindBySubscriptionAndUser() throws Exception {
        Slice<SubscriptionEntry> slice = subscriptionEntryRepository.findBySubscriptionAndUser(1L, 3L, DEFAULT_PAGE);
        assertList(slice.getContent());
    }

    @Test
    public void testFindNewBySubscriptionAndUser() throws Exception {
        Slice<SubscriptionEntry> slice = subscriptionEntryRepository.findNewBySubscriptionAndUser(1L, 1L, DEFAULT_PAGE);
        assertList(slice.getContent());
    }

    @Test
    public void testFindNewBySubscriptionTagAndUser() throws Exception {
        Slice<SubscriptionEntry> slice = subscriptionEntryRepository.findNewBySubscriptionTagAndUser(1L, "tag1", DEFAULT_PAGE);
        assertList(slice.getContent());
    }

    @Test
    public void testFindAllByUser() throws Exception {
        Slice<SubscriptionEntry> slice = subscriptionEntryRepository.findAllByUser(DEFAULT_PAGE, 1L);
        assertList(slice.getContent());
    }

    @Test
    public void testFindBySubscriptionTagAndUser() throws Exception {
        Slice<SubscriptionEntry> slice = subscriptionEntryRepository.findBySubscriptionTagAndUser("tag2", 1L, DEFAULT_PAGE);
        assertList(slice.getContent());
    }

    private void assertList(List<? extends Identifiable> list) {
        assumeThat(list, hasSize(greaterThan(1)));
        assertThat(list, isInDescendingOrdering());
    }
}
