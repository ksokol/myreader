package myreader.repository;

import myreader.entity.FetchError;
import myreader.entity.Subscription;
import myreader.test.WithTestProperties;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.jdbc.AutoConfigureDataJdbc;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.jdbc.core.JdbcAggregateOperations;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.OffsetDateTime;
import java.util.Date;

import static myreader.test.OffsetDateTimes.ofEpochMilli;
import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(SpringExtension.class)
@DataJpaTest(showSql = false)
@AutoConfigureDataJpa
@AutoConfigureDataJdbc
@WithTestProperties
class FetchErrorRepositoryTests {

  @Autowired
  private FetchErrorRepository fetchErrorRepository;

  @Autowired
  private JdbcAggregateOperations template;

  @Test
  void shouldDeleteEntriesWhenDateIsOlderThanNow() {
    createEntry(OffsetDateTime.now().minusDays(1));

    assertThat(fetchErrorRepository.retainFetchErrorBefore(new Date())).isOne();
  }

  @Test
  void shouldNotDeleteEntriesWhenDateIsNewerThanNow() {
    createEntry(OffsetDateTime.now().plusDays(1));

    assertThat(fetchErrorRepository.retainFetchErrorBefore(new Date())).isZero();
  }

  @Test
  void shouldOnlyDeleteEntriesThatAreOlderThanNow() {
    createEntry(OffsetDateTime.now().minusDays(1));
    var entry = createEntry(OffsetDateTime.now().plusDays(1));

    fetchErrorRepository.retainFetchErrorBefore(new Date());

    assertThat(fetchErrorRepository.findAll()).hasSize(1);
    assertThat(fetchErrorRepository.findById(entry.getId()).orElseThrow(AssertionError::new)).isNotNull();
  }

  private FetchError createEntry(OffsetDateTime localDateTime) {
    return createEntry(localDateTime, createSubscription());
  }

  private FetchError createEntry(OffsetDateTime localDateTime, Subscription subscription) {
    return template.save(new FetchError(subscription.getId(), "message", localDateTime));
  }

  private Subscription createSubscription() {
    return template.save(new Subscription(
      "url",
      "title",
      null,
      null,
      0,
      null,
      0,
      null,
      false,
      ofEpochMilli(1000)
    ));
  }
}
