package myreader.repository;

import myreader.entity.FetchError;
import myreader.entity.Subscription;
import myreader.test.WithTestProperties;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Date;

import static java.time.LocalDateTime.now;
import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(SpringExtension.class)
@DataJpaTest(showSql = false)
@WithTestProperties
class FetchErrorRepositoryTests {

  @Autowired
  private FetchErrorRepository fetchErrorRepository;

  @Autowired
  private TestEntityManager em;

  @Test
  void shouldDeleteEntriesWhenDateIsOlderThanNow() {
    createEntry(now().minusDays(1));

    assertThat(fetchErrorRepository.retainFetchErrorBefore(new Date())).isOne();
  }

  @Test
  void shouldNotDeleteEntriesWhenDateIsNewerThanNow() {
    createEntry(now().plusDays(1));

    assertThat(fetchErrorRepository.retainFetchErrorBefore(new Date())).isZero();
  }

  @Test
  void shouldOnlyDeleteEntriesThatAreOlderThanNow() {
    createEntry(now().minusDays(1));
    var entry = createEntry(now().plusDays(1));

    fetchErrorRepository.retainFetchErrorBefore(new Date());

    assertThat(fetchErrorRepository.findAll()).hasSize(1);
    assertThat(fetchErrorRepository.findById(entry.getId()).orElseThrow(AssertionError::new)).isNotNull();
  }

  private FetchError createEntry(LocalDateTime localDateTime) {
    return createEntry(localDateTime, createSubscription());
  }

  private FetchError createEntry(LocalDateTime localDateTime, Subscription subscription) {
    var date = Date.from(localDateTime.toInstant(ZoneOffset.UTC));
    var fetchError = new FetchError();

    fetchError.setSubscription(subscription);
    fetchError.setMessage("message");
    fetchError.setCreatedAt(date);

    return em.persist(fetchError);
  }

  private Subscription createSubscription() {
    var subscription = new Subscription("url", "title");
    return em.persist(subscription);
  }
}
