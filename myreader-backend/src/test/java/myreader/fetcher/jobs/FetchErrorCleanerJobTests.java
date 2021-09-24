package myreader.fetcher.jobs;

import myreader.repository.FetchErrorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Date;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

class FetchErrorCleanerJobTests {

  private FetchErrorCleanerJob job;

  private static final int retainDays = 7;
  private FetchErrorRepository fetchErrorRepository;

  @BeforeEach
  void setUp() {
    fetchErrorRepository = mock(FetchErrorRepository.class);

    job = new FetchErrorCleanerJob(retainDays, fetchErrorRepository);
  }

  @Test
  void shouldRetainEntriesWithGivenDate() {
    var localDate = LocalDate.now().minusDays(retainDays);
    var retainDate = Date.from(localDate.atStartOfDay().toInstant(ZoneOffset.UTC));

    /*
     * TODO fails when LocalDate.now() runs before midnight and job.work() after midnight
     *  waiting for https://github.com/junit-team/junit5/issues/1558
     */
    job.work();

    verify(fetchErrorRepository).retainFetchErrorBefore(retainDate);

  }
}
