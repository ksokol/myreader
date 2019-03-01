package myreader.service.feed;

import myreader.entity.Feed;
import myreader.fetcher.FeedParseException;
import myreader.fetcher.FeedParser;
import myreader.fetcher.persistence.FetchResult;
import myreader.repository.FeedRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.Optional;

import static java.util.Collections.emptyList;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.is;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.mockito.hamcrest.MockitoHamcrest.argThat;

/**
 * @author Kamill Sokol
 */
@RunWith(MockitoJUnitRunner.class)
public class FeedServiceTests {

    private static final String FEED_URL = "feed url";
    private static final String FEED_TITLE = "feed title";
    private static final FetchResult FETCH_RESULT = new FetchResult(emptyList(), "last modified", FEED_TITLE, "url", 0);

    @InjectMocks
    private FeedService feedService;

    @Mock
    private FeedRepository feedRepository;

    @Mock
    private FeedParser feedParser;

    @Test
    public void shouldReturnExistingFeed() {
        Feed expectedFeed = new Feed("title", "url");

        given(feedRepository.findByUrl(FEED_URL)).willReturn(expectedFeed);

        Feed actualFeed = feedService.findByUrl(FEED_URL);

        assertThat(actualFeed, is(expectedFeed));
    }

    @Test
    public void shouldFetchFeedFromUrlWhenFeedIsNew() {
        given(feedParser.parse(FEED_URL)).willReturn(Optional.of(FETCH_RESULT));

        feedService.findByUrl(FEED_URL);

        verify(feedParser).parse(FEED_URL);
    }

    @Test
    public void shouldSaveFeedWhenFeedIsNew() {
        given(feedParser.parse(FEED_URL)).willReturn(Optional.of(FETCH_RESULT));

        feedService.findByUrl(FEED_URL);

        verify(feedRepository).save(argThat(allOf(
                hasProperty("url", is(FEED_URL)),
                hasProperty("title", is(FEED_TITLE))
        )));
    }

    @Test
    public void shouldReturnSavedFeedWhenFeedIsNew() {
        Feed expectedFeed = new Feed("title", "url");

        given(feedParser.parse(FEED_URL)).willReturn(Optional.of(FETCH_RESULT));
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
        given(feedRepository.findByUrl(FEED_URL)).willReturn(new Feed("title", "url"));
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
