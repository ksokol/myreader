package myreader.repository;

import myreader.entity.Feed;
import myreader.entity.FeedEntry;
import myreader.entity.Subscription;
import myreader.entity.SubscriptionEntry;
import myreader.test.ClearDb;
import myreader.test.WithTestProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Collections;
import java.util.Date;

import static java.time.LocalDateTime.now;
import static myreader.test.TestUser.USER1;
import static myreader.test.TestUser.USER4;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.is;

@ExtendWith(SpringExtension.class)
@ClearDb
@DataJpaTest(showSql = false)
@WithTestProperties
class FeedEntryRepositoryTest {

    @Autowired
    private FeedEntryRepository feedEntryRepository;

    @Autowired
    private TestEntityManager em;

    private Feed feed;
    private Subscription user1Subscription;
    private Subscription user2Subscription;

    @BeforeEach
    void setUp() {
        feed = new Feed("feed", "http://example.com");
        em.persistAndFlush(feed);

        var user1 = em.persist(USER1.toUser());
        var user2 = em.persist(USER4.toUser());

        user1Subscription = new Subscription(user1, feed);
        em.persistAndFlush(user1Subscription);

        user2Subscription = new Subscription(user2, feed);
        em.persistAndFlush(user2Subscription);
    }

    @Test
    void shouldCountByFeedId() {
        givenEntryWithTitle("entry1");
        givenEntryWithTitle("entry2");

        var actualCount = feedEntryRepository.countByFeedId(feed.getId());

        assertThat(actualCount, is(2L));
    }

    @Test
    void shouldOrderEntriesByCreationDateDescending() {
        givenEntryWithTitleAndCreatedAt("entry1", new Date(0));
        givenEntryWithTitleAndCreatedAt("entry2", new Date(1));

        var actual = feedEntryRepository.findByFeedIdOrderByCreatedAtDesc(feed.getId(), PageRequest.of(0, 2));

        assertThat(actual.getContent(), contains(
                hasProperty("title", is("entry2")),
                hasProperty("title", is("entry1"))
        ));
    }

    @Test
    void shouldNotReturnFeedEntryIdWhenSubscriptionIsNotRead() {
        var entry = givenEntry();
        givenUser1SubscriptionEntry(entry);

        var actual = feedEntryRepository.findErasableEntryIdsByFeedIdAndCreatedAtEarlierThanRetainDate(
                feed.getId(),
                toDate(now().plusDays(1)),
                PageRequest.of(0, 2));

        assertThat(actual.getContent(), empty());
    }

    @Test
    void shouldNotReturnFeedEntryIdWhenSubscriptionEntryIsTaggedAndIsUnread() {
        var entry = givenEntry();
        givenUser1SubscriptionEntry(entry).setTags(Collections.singleton("not null"));

        var actual = feedEntryRepository.findErasableEntryIdsByFeedIdAndCreatedAtEarlierThanRetainDate(
                feed.getId(),
                toDate(now().plusDays(1)),
                PageRequest.of(0, 2));

        assertThat(actual.getContent(), empty());
    }

    @Test
    void shouldNotReturnFeedEntryIdSubscriptionEntryIsReadButIsTagged() {
        var entry = givenEntry();
        var subscriptionEntry = givenUser1SubscriptionEntry(entry);

        subscriptionEntry.setTags(Collections.singleton("some tag"));
        subscriptionEntry.setSeen(true);

        var actual = feedEntryRepository.findErasableEntryIdsByFeedIdAndCreatedAtEarlierThanRetainDate(
                feed.getId(),
                toDate(now().plusDays(1)),
                PageRequest.of(0, 2));

        assertThat(actual.getContent(), empty());
    }

    @Test
    void shouldReturnFeedEntryIdWhenCreatedAtIsEarlierThanRetainDateAndSubscriptionEntryHasNoTagAndIsRead() {
        var entry = givenEntry();
        givenUser1SubscriptionEntry(entry).setSeen(true);

        var actual = feedEntryRepository.findErasableEntryIdsByFeedIdAndCreatedAtEarlierThanRetainDate(
                feed.getId(),
                toDate(now().plusDays(1)),
                PageRequest.of(0, 2));

        assertThat(actual.getContent(), contains(entry.getId()));
    }

    @Test
    void shouldReturnUniqueFeedEntryIds() {
        var entry = givenEntry();
        givenUser1SubscriptionEntry(entry).setSeen(true);
        givenUser2SubscriptionEntry(entry).setSeen(true);

        var actual = feedEntryRepository.findErasableEntryIdsByFeedIdAndCreatedAtEarlierThanRetainDate(
                feed.getId(),
                toDate(now().plusDays(1)),
                PageRequest.of(0, 2));

        assertThat(actual.getContent(), contains(entry.getId()));
    }

    @Test
    void shouldNotReturnFeedEntryIdWhenAtLeastOneSubscriptionEntryIsUnreadOrIsTagged() {
        var entry1 = givenEntry();
        var entry2 = givenEntry();
        givenUser1SubscriptionEntry(entry1).setSeen(true);
        givenUser2SubscriptionEntry(entry1);
        givenUser1SubscriptionEntry(entry2).setSeen(true);
        givenUser2SubscriptionEntry(entry2).setSeen(true);

        var actual = feedEntryRepository.findErasableEntryIdsByFeedIdAndCreatedAtEarlierThanRetainDate(
                feed.getId(),
                toDate(now().plusDays(1)),
                PageRequest.of(0, 2));

        assertThat(actual.getContent(), contains(entry2.getId()));
    }

    @Test
    void shouldReturnFeedEntryIdWithoutSubscriptionEntry() {
        var entry1 = givenEntry();
        var entry2 = givenEntry();
        givenUser1SubscriptionEntry(entry1);

        var actual = feedEntryRepository.findErasableEntryIdsByFeedIdAndCreatedAtEarlierThanRetainDate(
                feed.getId(),
                toDate(now().plusDays(1)),
                PageRequest.of(0, 2));

        assertThat(actual.getContent(), contains(entry2.getId()));
    }

    @Test
    void shouldNotReturnFeedEntryIdWhenRetainDateIsEarlierThanCreatedAtAndSubscriptionEntryHasNoTagAndIsRead() {
        var entry = givenEntry();
        givenUser1SubscriptionEntry(entry).setSeen(true);

        var actual = feedEntryRepository.findErasableEntryIdsByFeedIdAndCreatedAtEarlierThanRetainDate(
                feed.getId(),
                toDate(now().minusDays(1)),
                PageRequest.of(0, 2));

        assertThat(actual.getContent(), empty());
    }

    private FeedEntry givenEntry() {
        return givenEntryWithTitle("entry");
    }

    private FeedEntry givenEntryWithTitle(String title) {
        var feedEntry = new FeedEntry(feed);
        feedEntry.setTitle(title);
        return em.persistAndFlush(feedEntry);
    }

    private void givenEntryWithTitleAndCreatedAt(String title, Date createdAt) {
        var feedEntry = new FeedEntry(feed);
        feedEntry.setTitle(title);
        feedEntry.setCreatedAt(createdAt);
        em.persistAndFlush(feedEntry);
    }

    private SubscriptionEntry givenUser1SubscriptionEntry(FeedEntry feedEntry) {
        var subscriptionEntry = new SubscriptionEntry(user1Subscription, feedEntry);
        return em.persistAndFlush(subscriptionEntry);
    }

    private SubscriptionEntry givenUser2SubscriptionEntry(FeedEntry feedEntry) {
        var subscriptionEntry = new SubscriptionEntry(user2Subscription, feedEntry);
        return em.persistAndFlush(subscriptionEntry);
    }

    private Date toDate(LocalDateTime localDateTime) {
        return Date.from(localDateTime.toInstant(ZoneOffset.UTC));
    }
}
