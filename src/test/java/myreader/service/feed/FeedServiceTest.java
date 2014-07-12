package myreader.service.feed;

import myreader.entity.Feed;
import myreader.fetcher.FeedParser;
import myreader.fetcher.impl.FetchResult;
import myreader.fetcher.persistence.FetcherEntry;
import myreader.repository.FeedRepository;
import myreader.test.IntegrationTestSupport;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.DirtiesContext;

import java.util.Collections;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.hamcrest.core.IsNull.nullValue;
import static org.mockito.Mockito.when;

/**
 * @author Kamill Sokol
 */
@DirtiesContext
public class FeedServiceTest extends IntegrationTestSupport {

    @Autowired
    private FeedService uut;
    @Autowired
    private FeedRepository feedRepository;
    @Autowired
    private FeedParser feedParserMock;

    @Test
    public void testExistingFeed() {
        String url = "http://use-the-index-luke.com/blog/feed";

        Feed findByUrl1 = feedRepository.findByUrl(url);
        assertThat(findByUrl1, notNullValue());

        Feed byUrl = uut.findByUrl(url);

        Feed findByUrl2 = feedRepository.findByUrl(url);
        assertThat(findByUrl2, notNullValue());
        assertThat(byUrl, is(findByUrl2));
    }

    @Test
    public void testNewFeed() {
        String feedUrl = "http://feeds.feedblitz.com/PetriKainulainen";
        String feedTitle = "feed title";

        FetchResult fetchResult = new FetchResult(Collections.<FetcherEntry>emptyList(), "last modified", feedTitle);
        when(feedParserMock.parse(feedUrl)).thenReturn(fetchResult);

        assertThat(feedRepository.findByUrl(feedUrl), nullValue());

        Feed newFeed = uut.findByUrl(feedUrl);

        Feed findByUrl1 = feedRepository.findByUrl(feedUrl);
        assertThat(newFeed, is(findByUrl1));

        assertThat(newFeed, hasProperty("url", is(feedUrl)));
        assertThat(newFeed, hasProperty("title", is(feedTitle)));
        assertThat(newFeed, hasProperty("lastModified", nullValue()));

        assertThat(findByUrl1, hasProperty("url", is(feedUrl)));
        assertThat(findByUrl1, hasProperty("title", is(feedTitle)));
        assertThat(findByUrl1, hasProperty("lastModified", nullValue()));
    }
}
