package myreader.fetcher.event;

import myreader.entity.Feed;
import myreader.entity.FetchError;
import myreader.repository.FeedRepository;
import myreader.repository.FetchErrorRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.Date;

import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.instanceOf;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.hamcrest.MockitoHamcrest.argThat;

/**
 * @since 2016-09
 */
@RunWith(MockitoJUnitRunner.class)
public class FetchErrorNotifierTests {

    @InjectMocks
    private FetchErrorNotifier notifier;

    @Mock
    private FeedRepository feedRepository;

    @Mock
    private FetchErrorRepository fetchErrorRepository;

    @Test
    public void shouldNotPersistEventWhenFeedIsUnknown() {
        given(feedRepository.findByUrl("url")).willReturn(null);

        notifier.processFetchErrorEvent(new FetchErrorEvent("url", "irrelevant"));

        verify(feedRepository).findByUrl("url");
        verify(fetchErrorRepository, never()).save(any(FetchError.class));
    }

    @Test
    public void shouldPersistEvent() {
        Feed feed = new Feed("title", "url");

        given(feedRepository.findByUrl("url")).willReturn(feed);

        notifier.processFetchErrorEvent(new FetchErrorEvent("url", "errorMessage"));

        verify(fetchErrorRepository).save(argThat(
                allOf(
                        hasProperty("id", nullValue()),
                        hasProperty("feed", is(feed)),
                        hasProperty("message", is("errorMessage")),
                        hasProperty("createdAt", instanceOf(Date.class))
                ))
        );
    }

}
