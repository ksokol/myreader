package myreader.repository;

import myreader.entity.Feed;
import myreader.entity.FeedEntry;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.entity.User;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Date;

import static java.time.LocalDateTime.now;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringRunner.class)
@DataJpaTest
public class FeedEntryRepositoryTest {

    @Autowired
    private FeedEntryRepository feedEntryRepository;

    @Autowired
    private TestEntityManager em;

    private Feed feed;
    private Subscription user1Subscription;
    private Subscription user2Subscription;

    @Before
    public void setUp() {
        feed = new Feed("feed", "http://example.com");
        em.persistAndFlush(feed);

        User user1 = new User("email");
        em.persistAndFlush(user1);

        User user2 = new User("email1");
        em.persistAndFlush(user2);

        user1Subscription = new Subscription(user1, feed);
        em.persistAndFlush(user1Subscription);

        user2Subscription = new Subscription(user2, feed);
        em.persistAndFlush(user2Subscription);
    }

    @Test
    public void shouldCountByFeedId() {
        givenEntryWithTitle("entry1");
        givenEntryWithTitle("entry2");

        long actualCount = feedEntryRepository.countByFeedId(feed.getId());

        assertThat(actualCount, is(2L));
    }

    @Test
    public void shouldOrderEntriesByCreationDateDescending() {
        givenEntryWithTitleAndCreatedAt("entry1", new Date(0));
        givenEntryWithTitleAndCreatedAt("entry2", new Date(1));

        Page<FeedEntry> actual = feedEntryRepository.findByFeedIdOrderByCreatedAtDesc(feed.getId(), PageRequest.of(0, 2));

        assertThat(actual.getContent(), contains(
                hasProperty("title", is("entry2")),
                hasProperty("title", is("entry1"))
        ));
    }

    @Test
    public void shouldNotReturnFeedEntryIdWhenSubscriptionIsNotRead() {
        FeedEntry entry = givenEntry();
        givenUser1SubscriptionEntry(entry);

        Page<Long> actual = feedEntryRepository.findErasableEntryIdsByFeedIdAndCreatedAtEarlierThanRetainDate(
                feed.getId(),
                toDate(now().plusDays(1)),
                PageRequest.of(0, 2));

        assertThat(actual.getContent(), empty());
    }

    @Test
    public void shouldNotReturnFeedEntryIdWhenSubscriptionEntryIsTaggedAndIsUnread() {
        FeedEntry entry = givenEntry();
        givenUser1SubscriptionEntry(entry).setTag("not null");

        Page<Long> actual = feedEntryRepository.findErasableEntryIdsByFeedIdAndCreatedAtEarlierThanRetainDate(
                feed.getId(),
                toDate(now().plusDays(1)),
                PageRequest.of(0, 2));

        assertThat(actual.getContent(), empty());
    }

    @Test
    public void shouldNotReturnFeedEntryIdSubscriptionEntryIsReadButIsTagged() {
        FeedEntry entry = givenEntry();
        SubscriptionEntry subscriptionEntry = givenUser1SubscriptionEntry(entry);

        subscriptionEntry.setTag("");
        subscriptionEntry.setSeen(true);

        Page<Long> actual = feedEntryRepository.findErasableEntryIdsByFeedIdAndCreatedAtEarlierThanRetainDate(
                feed.getId(),
                toDate(now().plusDays(1)),
                PageRequest.of(0, 2));

        assertThat(actual.getContent(), empty());
    }

    @Test
    public void shouldReturnFeedEntryIdWhenCreatedAtIsEarlierThanRetainDateAndSubscriptionEntryHasNoTagAndIsRead() {
        FeedEntry entry = givenEntry();
        givenUser1SubscriptionEntry(entry).setSeen(true);

        Page<Long> actual = feedEntryRepository.findErasableEntryIdsByFeedIdAndCreatedAtEarlierThanRetainDate(
                feed.getId(),
                toDate(now().plusDays(1)),
                PageRequest.of(0, 2));

        assertThat(actual.getContent(), contains(entry.getId()));
    }

    @Test
    public void shouldReturnUniqueFeedEntryIds() {
        FeedEntry entry = givenEntry();
        givenUser1SubscriptionEntry(entry).setSeen(true);
        givenUser2SubscriptionEntry(entry).setSeen(true);

        Page<Long> actual = feedEntryRepository.findErasableEntryIdsByFeedIdAndCreatedAtEarlierThanRetainDate(
                feed.getId(),
                toDate(now().plusDays(1)),
                PageRequest.of(0, 2));

        assertThat(actual.getContent(), contains(entry.getId()));
    }

    @Test
    public void shouldNotReturnFeedEntryIdWhenAtLeastOneSubscriptionEntryIsUnreadOrIsTagged() {
        FeedEntry entry1 = givenEntry();
        FeedEntry entry2 = givenEntry();
        givenUser1SubscriptionEntry(entry1).setSeen(true);
        givenUser2SubscriptionEntry(entry1);
        givenUser1SubscriptionEntry(entry2).setSeen(true);
        givenUser2SubscriptionEntry(entry2).setSeen(true);

        Page<Long> actual = feedEntryRepository.findErasableEntryIdsByFeedIdAndCreatedAtEarlierThanRetainDate(
                feed.getId(),
                toDate(now().plusDays(1)),
                PageRequest.of(0, 2));

        assertThat(actual.getContent(), contains(entry2.getId()));
    }

    @Test
    public void shouldReturnFeedEntryIdWithoutSubscriptionEntry() {
        FeedEntry entry1 = givenEntry();
        FeedEntry entry2 = givenEntry();
        givenUser1SubscriptionEntry(entry1);

        Page<Long> actual = feedEntryRepository.findErasableEntryIdsByFeedIdAndCreatedAtEarlierThanRetainDate(
                feed.getId(),
                toDate(now().plusDays(1)),
                PageRequest.of(0, 2));

        assertThat(actual.getContent(), contains(entry2.getId()));
    }

    @Test
    public void shouldNotReturnFeedEntryIdWhenRetainDateIsEarlierThanCreatedAtAndSubscriptionEntryHasNoTagAndIsRead() {
        FeedEntry entry = givenEntry();
        givenUser1SubscriptionEntry(entry).setSeen(true);

        Page<Long> actual = feedEntryRepository.findErasableEntryIdsByFeedIdAndCreatedAtEarlierThanRetainDate(
                feed.getId(),
                toDate(now().minusDays(1)),
                PageRequest.of(0, 2));

        assertThat(actual.getContent(), empty());
    }

    private FeedEntry givenEntry() {
        return givenEntryWithTitle("entry");
    }

    private FeedEntry givenEntryWithTitle(String title) {
        FeedEntry feedEntry = new FeedEntry(feed);
        feedEntry.setTitle(title);
        return em.persistAndFlush(feedEntry);
    }

    private void givenEntryWithTitleAndCreatedAt(String title, Date createdAt) {
        FeedEntry feedEntry = new FeedEntry(feed);
        feedEntry.setTitle(title);
        feedEntry.setCreatedAt(createdAt);
        em.persistAndFlush(feedEntry);
    }


    private SubscriptionEntry givenUser1SubscriptionEntry(FeedEntry feedEntry) {
        SubscriptionEntry subscriptionEntry = new SubscriptionEntry(user1Subscription, feedEntry);
        return em.persistAndFlush(subscriptionEntry);
    }

    private SubscriptionEntry givenUser2SubscriptionEntry(FeedEntry feedEntry) {
        SubscriptionEntry subscriptionEntry = new SubscriptionEntry(user2Subscription, feedEntry);
        return em.persistAndFlush(subscriptionEntry);
    }

    private Date toDate(LocalDateTime localDateTime) {
        return Date.from(localDateTime.toInstant(ZoneOffset.UTC));
    }
}
