package myreader.service.subscriptionentry.impl;

import myreader.entity.Feed;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.fetcher.persistence.FetcherEntry;
import myreader.repository.FeedRepository;
import myreader.repository.SubscriptionRepository;
import myreader.service.subscriptionentry.SubscriptionEntryBatchService;
import myreader.test.UnittestSupport;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.Arrays;
import java.util.List;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;

/**
 * @author Kamill Sokol
 */
public class SubscriptionEntryBatchServiceImplTest extends UnittestSupport {

    @Autowired
    private SubscriptionEntryBatchService uut;
    @Autowired
    private SubscriptionRepository subscriptionRepository;
    @Autowired
    private FeedRepository feedRepository;
    @PersistenceContext
    private EntityManager em;

    @Ignore("until whole process is split up into maintainable function blocks")
    @Test
    public void testUpdateUserSubscriptionEntries() {
        Feed beforeFeed = feedRepository.findOne(2L);
        Subscription beforeSubscription = subscriptionRepository.findOne(3L);

        assertThat(beforeFeed.getUrl(), is(beforeSubscription.getFeed().getUrl()));
        assertThat(beforeFeed.getEntries().size(), is(3));
        assertThat(beforeSubscription.getSubscriptionEntries().size(), is(2));
        assertThat(beforeSubscription.getUnseen(), is(0));
        assertThat(beforeSubscription.getSum(), is(25));

        List<SubscriptionEntry> subscriptionEntries = uut.updateUserSubscriptionEntries(beforeFeed, Arrays.asList(fetcherEntry(2L)));
        assertThat(subscriptionEntries.size(), is(1));

        Feed afterFeed = feedRepository.findOne(2L);
        Subscription afterSubscription = subscriptionRepository.findOne(3L);

        assertThat(afterFeed.getUrl(), is(beforeSubscription.getFeed().getUrl()));
        assertThat(afterFeed.getEntries().size(), is(3));
        assertThat(afterSubscription.getSubscriptionEntries().size(), is(2));
        assertThat(afterSubscription.getUnseen(), is(0));
        assertThat(afterSubscription.getSum(), is(25));

        em.clear();

        assertThat(feedRepository.findOne(2L).getEntries().size(), is(4));
        Subscription afterSubscriptionClearedEm = subscriptionRepository.findOne(3L);
        assertThat(afterSubscriptionClearedEm.getSubscriptionEntries().size(), is(3));
        assertThat(afterSubscriptionClearedEm.getUnseen(), is(1));
        assertThat(afterSubscriptionClearedEm.getSum(), is(26));
    }

    private FetcherEntry fetcherEntry(Long id) {
        FetcherEntry fetcherEntry = new FetcherEntry();
        fetcherEntry.setTitle("title");
        fetcherEntry.setUrl("url");
        fetcherEntry.setContent("content");
        fetcherEntry.setFeedId(id);
        fetcherEntry.setGuid("guid");
        return fetcherEntry;
    }
}
