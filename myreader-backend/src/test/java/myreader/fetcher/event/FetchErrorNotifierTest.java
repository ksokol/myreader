package myreader.fetcher.event;

import myreader.entity.Feed;
import myreader.entity.FetchError;
import myreader.repository.FeedRepository;
import myreader.repository.FetchErrorRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.Date;

import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.instanceOf;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

/**
 * @since 2016-09
 */
@RunWith(MockitoJUnitRunner.class)
public class FetchErrorNotifierTest {

    @InjectMocks
    private FetchErrorNotifier notifier;

    @Mock
    private FeedRepository feedRepository;

    @Mock
    private FetchErrorRepository fetchErrorRepository;

    @Test
    public void shouldNotPersistEventWhenFeedIsUnknown() throws Exception {
        given(feedRepository.findByUrl("url")).willReturn(null);

        notifier.processFetchErrorEvent(new FetchErrorEvent("url", "irrelevant"));

        verify(feedRepository).findByUrl("url");
        verify(fetchErrorRepository, never()).save(any(FetchError.class));
    }

    @Test
    public void shouldPersistEvent() throws Exception {
        Feed feed = new Feed();
        feed.setId(1L);

        given(feedRepository.findByUrl("url")).willReturn(feed);

        notifier.processFetchErrorEvent(new FetchErrorEvent("url", "errorMessage"));

        verify(fetchErrorRepository).save(Mockito.<FetchError>argThat(
                allOf(
                        hasProperty("id", nullValue()),
                        hasProperty("feed", is(feed)),
                        hasProperty("message", is("errorMessage")),
                        hasProperty("createdAt", instanceOf(Date.class))
                ))
        );
    }

}