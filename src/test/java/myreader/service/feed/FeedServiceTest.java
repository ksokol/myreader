package myreader.service.feed;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.core.IsNull.nullValue;
import static org.mockito.Mockito.when;

import myreader.entity.Feed;
import myreader.fetcher.FeedParser;
import myreader.fetcher.persistence.FetchResult;
import myreader.fetcher.persistence.FetcherEntry;
import myreader.repository.FeedRepository;
import myreader.test.IntegrationTestSupport;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Collections;

/**
 * @author Kamill Sokol
 */
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
        assertThat(byUrl.getId(), is(findByUrl2.getId()));
        assertThat(byUrl.getUrl(), is(findByUrl2.getUrl()));
    }

    @Test
    public void testNewFeed() {
        String feedUrl = "irrelevant";
        String feedTitle = "feed title";

        FetchResult fetchResult = new FetchResult(Collections.<FetcherEntry>emptyList(), "last modified", feedTitle);
        when(feedParserMock.parse(feedUrl)).thenReturn(fetchResult);

        assertThat(feedRepository.findByUrl(feedUrl), nullValue());

        Feed newFeed = uut.findByUrl(feedUrl);

        Feed findByUrl1 = feedRepository.findByUrl(feedUrl);
        assertThat(newFeed.getId(), is(findByUrl1.getId()));
        assertThat(newFeed.getUrl(), is(findByUrl1.getUrl()));

        assertThat(newFeed, hasProperty("url", is(feedUrl)));
        assertThat(newFeed, hasProperty("title", is(feedTitle)));
        assertThat(newFeed, hasProperty("lastModified", nullValue()));

        assertThat(findByUrl1, hasProperty("url", is(feedUrl)));
        assertThat(findByUrl1, hasProperty("title", is(feedTitle)));
        assertThat(findByUrl1, hasProperty("lastModified", nullValue()));
    }
}
