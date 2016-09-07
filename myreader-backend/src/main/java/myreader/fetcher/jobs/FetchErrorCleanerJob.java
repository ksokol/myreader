package myreader.fetcher.jobs;

import myreader.repository.FetchErrorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.Assert;

import java.time.Clock;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Date;
import java.util.Objects;

/**
 * @author Kamill Sokol
 */
public class FetchErrorCleanerJob extends BaseJob {

    private static final Logger log = LoggerFactory.getLogger(FetchErrorCleanerJob.class);

    private final Clock clock;
    private final int retainDays;
    private final FetchErrorRepository fetchErrorRepository;

    public FetchErrorCleanerJob(Clock clock, int retainDays, FetchErrorRepository fetchErrorRepository) {
        super("FetchErrorCleanerJob");
        Objects.requireNonNull(clock, "clock is null");
        Objects.requireNonNull(fetchErrorRepository, "fetchErrorRepository is null");
        Assert.isTrue(retainDays > 0, "retainDays must be greater than 0");
        this.clock = clock;
        this.retainDays = retainDays;
        this.fetchErrorRepository = fetchErrorRepository;
    }

    @Override
    public void work() {
        LocalDate localDate = LocalDate.now(clock).minusDays(retainDays);
        Date retainDate = Date.from(localDate.atStartOfDay().toInstant(ZoneOffset.UTC));

        int deleteCount = fetchErrorRepository.retainFetchErrorBefore(retainDate);
        log.info("deleted {} entries that are older than {}", deleteCount, retainDate);
    }
}
