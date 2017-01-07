package myreader.repository;

import myreader.entity.Feed;
import myreader.entity.FeedEntry;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.junit4.SpringRunner;

import static org.hamcrest.Matchers.contains;
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

    @Test
    public void shouldCountByFeedId() throws Exception {
        Feed feed = givenFeed();
        givenEntryWithTitle(feed, "entry1");
        givenEntryWithTitle(feed, "entry2");

        long actualCount = feedEntryRepository.countByFeedId(feed.getId());

        assertThat(actualCount, is(2L));
    }

    @Test
    public void shouldOrderEntriesByCreationDateDescending() throws Exception {
        Feed feed = givenFeed();
        givenEntryWithTitle(feed, "entry1");
        givenEntryWithTitle(feed, "entry2");

        Page<FeedEntry> actual = feedEntryRepository.findByFeedIdOrderByCreatedAtDesc(feed.getId(), new PageRequest(0, 2));

        assertThat(actual.getContent(), contains(
                hasProperty("title", is("entry2")),
                hasProperty("title", is("entry1"))
        ));
    }

    private Feed givenFeed() {
        Feed feed = new Feed("feed");
        em.persist(feed);
        return feed;
    }

    private void givenEntryWithTitle(Feed feed, String entry) {
        FeedEntry feedEntry2 = new FeedEntry(feed);
        feedEntry2.setTitle(entry);
        em.persistAndFlush(feedEntry2);
    }
}
