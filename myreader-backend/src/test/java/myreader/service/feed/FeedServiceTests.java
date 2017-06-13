package myreader.service.feed;

import myreader.entity.Feed;
import myreader.fetcher.FeedParseException;
import myreader.fetcher.FeedParser;
import myreader.fetcher.persistence.FetchResult;
import myreader.repository.FeedRepository;
import org.hamcrest.Matchers;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.Collections;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.is;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.argThat;
import static org.mockito.Mockito.verify;

/**
 * @author Kamill Sokol
 */
@RunWith(MockitoJUnitRunner.class)
public class FeedServiceTests {

    private static final String FEED_URL = "feed url";
    private static final String FEED_TITLE = "feed title";
    private static final FetchResult FETCH_RESULT = new FetchResult(Collections.emptyList(), "last modified", FEED_TITLE);

    @InjectMocks
    private FeedService feedService;

    @Mock
    private FeedRepository feedRepository;

    @Mock
    private FeedParser feedParser;

    @Test
    public void shouldReturnExistingFeed() {
        Feed expectedFeed = new Feed();

        given(feedRepository.findByUrl(FEED_URL)).willReturn(expectedFeed);

        Feed actualFeed = feedService.findByUrl(FEED_URL);

        assertThat(actualFeed, is(expectedFeed));
    }

    @Test
    public void shouldFetchFeedFromUrlWhenFeedIsNew() {
        given(feedParser.parse(FEED_URL)).willReturn(FETCH_RESULT);

        feedService.findByUrl(FEED_URL);

        verify(feedParser).parse(FEED_URL);
    }

    @Test
    public void shouldSaveFeedWhenFeedIsNew() {
        given(feedParser.parse(FEED_URL)).willReturn(FETCH_RESULT);

        feedService.findByUrl(FEED_URL);

        verify(feedRepository).save(argThat(Matchers.<Feed>allOf(
                hasProperty("url", is(FEED_URL)),
                hasProperty("title", is(FEED_TITLE))
        )));
    }

    @Test
    public void shouldReturnSavedFeedWhenFeedIsNew() {
        Feed expectedFeed = new Feed();

        given(feedParser.parse(FEED_URL)).willReturn(FETCH_RESULT);
        given(feedRepository.save(Mockito.any(Feed.class))).willReturn(expectedFeed);

        Feed actualFeed = feedService.findByUrl(FEED_URL);

        assertThat(actualFeed, is(expectedFeed));
    }


    @Test
    public void shouldRejectUrlWhenUrlIsEmpty() {
        assertThat(feedService.valid(null), is(false));
    }

    @Test
    public void shouldAcceptUrlWhenCorrespondingFeedFound() {
        given(feedRepository.findByUrl(FEED_URL)).willReturn(new Feed());
        assertThat(feedService.valid(FEED_URL), is(true));
    }

    @Test
    public void shouldRejectUrlWhenFetchCausesAnException() {
        given(feedParser.parse(FEED_URL)).willThrow(new FeedParseException());
        assertThat(feedService.valid(FEED_URL), is(false));
    }

    @Test
    public void shouldAcceptUrl() {
        assertThat(feedService.valid(FEED_URL), is(true));
    }
}
