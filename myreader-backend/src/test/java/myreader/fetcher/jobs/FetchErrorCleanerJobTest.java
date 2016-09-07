package myreader.fetcher.jobs;

import myreader.repository.FetchErrorRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;

import java.time.Clock;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.Date;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

/**
 * @author Kamill Sokol
 */
@RunWith(MockitoJUnitRunner.class)
public class FetchErrorCleanerJobTest {

    private FetchErrorCleanerJob job;

    private Clock clock = Clock.fixed(LocalDateTime.of(2016, 9, 7, 0, 0).toInstant(ZoneOffset.UTC), ZoneId.of("UTC"));
    private int retainDays = 7;
    private FetchErrorRepository fetchErrorRepository;

    @Before
    public void setUp() {
        fetchErrorRepository = mock(FetchErrorRepository.class);

        job = new FetchErrorCleanerJob(clock, retainDays, fetchErrorRepository);
    }

    @Test
    public void shouldRetainEntriesWithGivenDate() throws Exception {
        LocalDate localDate = LocalDate.now(clock).minusDays(retainDays);
        Date retainDate = Date.from(localDate.atStartOfDay().toInstant(ZoneOffset.UTC));

        job.work();

        verify(fetchErrorRepository).retainFetchErrorBefore(retainDate);
    }

    @Test
    public void shouldNameJobWithGivenName() {
        assertThat(job.getJobName(), is("FetchErrorCleanerJob"));
    }

}