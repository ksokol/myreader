package myreader.fetcher.event;

import myreader.entity.FetchError;
import myreader.entity.Subscription;
import myreader.test.WithTestProperties;
import org.assertj.core.api.InstanceOfAssertFactories;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.jdbc.core.JdbcAggregateOperations;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;

import static myreader.test.OffsetDateTimes.ofEpochMilli;
import static org.assertj.core.api.Assertions.as;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.within;

@ExtendWith(SpringExtension.class)
@Transactional
@SpringBootTest
@WithTestProperties
class FetchErrorNotifierTests {

  @Autowired
  private JdbcAggregateOperations template;

  @Autowired
  private FetchErrorNotifier notifier;

  @Test
  void shouldNotPersistEventWhenFeedIsUnknown() {
    notifier.processFetchErrorEvent(new FetchErrorEvent("url", "irrelevant"));

    assertThat(template.count(FetchError.class))
      .isZero();
  }

  @Test
  void shouldPersistEvent() {
    var subscription = template.save(new Subscription(
      "url",
      "title",
      null,
      null,
      0,
      null,
      0,
      null,
      ofEpochMilli(1000)
    ));

    var timeRightBeforeCreation = OffsetDateTime.now();
    notifier.processFetchErrorEvent(new FetchErrorEvent("url", "errorMessage"));

    assertThat(template.findAll(FetchError.class))
      .hasSize(1)
      .element(0)
      .hasFieldOrPropertyWithValue("subscriptionId", subscription.getId())
      .hasFieldOrPropertyWithValue("message", "errorMessage")
      .extracting(FetchError::getCreatedAt, as(InstanceOfAssertFactories.OFFSET_DATE_TIME))
      .isCloseTo(timeRightBeforeCreation, within(2, ChronoUnit.SECONDS));
  }
}
