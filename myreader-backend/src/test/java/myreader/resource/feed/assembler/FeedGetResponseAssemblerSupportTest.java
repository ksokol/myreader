package myreader.resource.feed.assembler;

import myreader.entity.Feed;
import myreader.repository.FetchErrorRepository;
import myreader.resource.feed.beans.FeedGetResponse;
import org.hamcrest.Matcher;
import org.junit.Before;
import org.junit.Test;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;
import java.util.Date;

import static org.hamcrest.MatcherAssert.assertThat;
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

    private FeedGetResponseAssemblerSupport assembler;

    private FetchErrorRepository fetchErrorRepository = mock(FetchErrorRepository.class);
    private Clock clock = Clock.fixed(Instant.EPOCH, ZoneId.of("UTC"));

    private Feed feed;

    @Before
    public void setUp() {
        assembler = new FeedGetResponseAssemblerSupport(fetchErrorRepository, clock, 1);
    }

    @Test
    public void shouldConvertSourceToTarget() throws Exception {
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
    public void shouldSetHasErrorsToFalse() throws Exception {
        givenFeedWithErrors(0);

        assertFeed(hasProperty("hasErrors", is(false)));
    }

    @Test
    public void shouldSetHasErrorsToTrue() throws Exception {
        givenFeedWithErrors(1);

        assertFeed(hasProperty("hasErrors", is(true)));
    }

    private void assertFeed(Matcher<FeedGetResponse> matcher) {
        assertThat(assembler.toResource(feed), matcher);
    }

    private Feed givenFeedWithErrors(int errors) {
        feed = new Feed();
        feed.setId(FEED_ID);
        feed.setTitle("title");
        feed.setUrl("url");
        feed.setLastModified("lastModified");
        feed.setFetched(2);
        feed.setCreatedAt(EPOCH_PLUS_MINUTE);

        given(fetchErrorRepository.countByFeedIdAndCreatedAtGreaterThan(eq(FEED_ID), any())).willReturn(errors);

        return feed;
    }

}