package myreader.repository;

import myreader.entity.Feed;
import myreader.entity.FetchError;
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
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringRunner.class)
@DataJpaTest(showSql = false)
public class FetchErrorRepositoryTests {

    @Autowired
    private FetchErrorRepository fetchErrorRepository;

    @Autowired
    private TestEntityManager em;

    @Test
    public void shouldDeleteEntriesWhenDateIsOlderThanNow() {
        createEntry(now().minusDays(1));

        assertThat(fetchErrorRepository.retainFetchErrorBefore(new Date()), is(1));
    }

    @Test
    public void shouldNotDeleteEntriesWhenDateIsNewerThanNow() {
        createEntry(now().plusDays(1));

        assertThat(fetchErrorRepository.retainFetchErrorBefore(new Date()), is(0));
    }

    @Test
    public void shouldOnlyDeleteEntriesThatAreOlderThanNow() {
        createEntry(now().minusDays(1));
        FetchError entry = createEntry(now().plusDays(1));

        fetchErrorRepository.retainFetchErrorBefore(new Date());

        assertThat(fetchErrorRepository.findAll(), hasSize(1));
        assertThat(fetchErrorRepository.findById(entry.getId()).orElseThrow(AssertionError::new), notNullValue());
    }

    @Test
    public void shouldBindByFeedId() {
        Feed feed = createFeed();
        FetchError entry = createEntry(feed);
        createEntry(createFeed());

        Page<FetchError> result = fetchErrorRepository.findByFeedIdOrderByCreatedAtDesc(feed.getId(), PageRequest.of(0, 5));

        assertThat(result.getContent(), contains(entry));
    }

    @Test
    public void shouldFindByFeedIdPage() {
        Feed feed = createFeed();
        createEntry(feed);
        createEntry(feed);
        createEntry(feed);
        createEntry(createFeed());

        Page<FetchError> result = fetchErrorRepository.findByFeedIdOrderByCreatedAtDesc(feed.getId(), PageRequest.of(0, 2));

        assertThat(result.getTotalPages(), is(2));
        assertThat(result.getTotalElements(), is(3L));
    }

    @Test
    public void shouldFindByFeedIdOrderByCreatedAtDesc() {
        Feed feed = createFeed();
        LocalDateTime yesterday = now().minusDays(1);
        LocalDateTime tomorrow = now().plusDays(1);
        LocalDateTime now = now();

        createEntry(yesterday, feed);
        createEntry(tomorrow, feed);
        createEntry(now, feed);

        Page<FetchError> result = fetchErrorRepository.findByFeedIdOrderByCreatedAtDesc(feed.getId(), PageRequest.of(0, 5));

        assertThat(result.getContent(), contains(
                hasProperty("createdAt", is(toDate(tomorrow))),
                hasProperty("createdAt", is(toDate(now))),
                hasProperty("createdAt", is(toDate(yesterday)))
        ));
    }

    @Test
    public void shouldCountByFeedId() {
        Feed feed = createFeed();
        createEntry(now(), feed);
        createEntry(now().minusMinutes(15), feed);

        int expectedCount = fetchErrorRepository.countByFeedId(feed.getId());

        assertThat(expectedCount, is(2));
    }

    private FetchError createEntry(Feed feed) {
        return createEntry(now(), feed);
    }

    private FetchError createEntry(LocalDateTime localDateTime) {
        return createEntry(localDateTime, createFeed());
    }

    private FetchError createEntry(LocalDateTime localDateTime, Feed feed) {
        Date date = Date.from(localDateTime.toInstant(ZoneOffset.UTC));

        FetchError fetchError = new FetchError();
        fetchError.setFeed(feed);
        fetchError.setMessage("message");
        fetchError.setCreatedAt(date);

        em.persist(fetchError);
        return fetchError;
    }

    private Feed createFeed() {
        Feed feed = new Feed("title", "url");
        em.persist(feed);

        return feed;
    }

    private Date toDate(LocalDateTime localDateTime) {
        return Date.from(localDateTime.toInstant(ZoneOffset.UTC));
    }
}
