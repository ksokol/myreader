package myreader.fetcher.event;

import myreader.entity.FetchError;
import myreader.entity.Subscription;
import myreader.repository.FetchErrorRepository;
import myreader.repository.SubscriptionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Date;
import java.util.Optional;

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

@ExtendWith(MockitoExtension.class)
class FetchErrorNotifierTests {

  @InjectMocks
  private FetchErrorNotifier notifier;

  @Mock
  private SubscriptionRepository subscriptionRepository;

  @Mock
  private FetchErrorRepository fetchErrorRepository;

  @Test
  void shouldNotPersistEventWhenFeedIsUnknown() {
    given(subscriptionRepository.findByUrl("url")).willReturn(Optional.empty());

    notifier.processFetchErrorEvent(new FetchErrorEvent("url", "irrelevant"));

    verify(fetchErrorRepository, never()).save(any(FetchError.class));
  }

  @Test
  void shouldPersistEvent() {
    Subscription subscription = new Subscription("url", "title");

    given(subscriptionRepository.findByUrl("url")).willReturn(Optional.of(subscription));

    notifier.processFetchErrorEvent(new FetchErrorEvent("url", "errorMessage"));

    verify(fetchErrorRepository).save(argThat(
      allOf(
        hasProperty("id", nullValue()),
        hasProperty("subscription", is(subscription)),
        hasProperty("message", is("errorMessage")),
        hasProperty("createdAt", instanceOf(Date.class))
      ))
    );
  }

}
