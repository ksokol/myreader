package myreader.resource.feed.assembler;

import myreader.entity.Feed;
import myreader.repository.FetchErrorRepository;
import myreader.resource.feed.beans.FeedGetResponse;
import org.hamcrest.Matcher;
import org.junit.Before;
import org.junit.Test;

import java.time.Instant;
import java.util.Date;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.core.AllOf.allOf;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;

/**
 * @author Kamill Sokol
 */
public class FeedGetResponseAssemblerSupportTest {

    private static final long FEED_ID = 1L;
    private static final Date EPOCH_PLUS_MINUTE = Date.from(Instant.EPOCH.plusSeconds(60));

    private FetchErrorRepository fetchErrorRepository = mock(FetchErrorRepository.class);
    private FeedGetResponseAssemblerSupport assembler;
    private Feed feed;

    @Before
    public void setUp() {
        assembler = new FeedGetResponseAssemblerSupport(fetchErrorRepository);
    }

    @Test
    public void shouldConvertSourceToTarget() {
        givenFeedWithErrors(0);

        assertFeed(allOf(
                hasProperty("uuid", is("1")),
                hasProperty("title", is("title")),
                hasProperty("url", is("url")),
                hasProperty("lastModified", is("lastModified")),
                hasProperty("createdAt", is(EPOCH_PLUS_MINUTE))
        ));
    }

    @Test
    public void shouldSetHasErrorsToFalse() {
        givenFeedWithErrors(0);

        assertFeed(hasProperty("hasErrors", is(false)));
    }

    @Test
    public void shouldSetHasErrorsToTrue() {
        givenFeedWithErrors(1);

        assertFeed(hasProperty("hasErrors", is(true)));
    }

    @Test
    public void shouldContainExpectedLinks() {
        givenFeedWithErrors(0);

        assertFeed(
                hasProperty("links",
                        contains(allOf(
                                hasProperty("rel", is("fetchErrors")),
                                hasProperty("href", is("/api/2/feeds/1/fetchError"))
                        ))
                )
        );
    }

    private void assertFeed(Matcher<FeedGetResponse> matcher) {
        assertThat(assembler.toResource(feed), matcher);
    }

    private void givenFeedWithErrors(int errors) {
        feed = new Feed("url", "title");
        feed.setId(FEED_ID);
        feed.setLastModified("lastModified");
        feed.setFetched(2);
        feed.setCreatedAt(EPOCH_PLUS_MINUTE);

        given(fetchErrorRepository.countByFeedId(eq(FEED_ID))).willReturn(errors);
    }
}
