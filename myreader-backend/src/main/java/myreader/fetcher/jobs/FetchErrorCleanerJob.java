package myreader.fetcher.jobs;

import myreader.repository.FetchErrorRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

import java.time.Clock;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Date;

import static java.util.Objects.requireNonNull;

/**
 * @author Kamill Sokol
 */
@Component
@ConditionalOnTaskEnabled
public class FetchErrorCleanerJob extends BaseJob {

    private final Clock clock;
    private final int retainDays;
    private final FetchErrorRepository fetchErrorRepository;

    public FetchErrorCleanerJob(Clock clock,
                                @Value("${job.fetchError.retainInDays}") int retainDays,
                                FetchErrorRepository fetchErrorRepository) {
        super("FetchErrorCleanerJob");
        Assert.isTrue(retainDays > 0, "retainDays must be greater than 0");
        this.clock = requireNonNull(clock, "clock is null");
        this.retainDays = retainDays;
        this.fetchErrorRepository = requireNonNull(fetchErrorRepository, "fetchErrorRepository is null");
    }

    @Scheduled(cron = "0 30 2 * * *")
    @Override
    public void work() {
        LocalDate localDate = LocalDate.now(clock).minusDays(retainDays);
        Date retainDate = Date.from(localDate.atStartOfDay().toInstant(ZoneOffset.UTC));

        int deleteCount = fetchErrorRepository.retainFetchErrorBefore(retainDate);
        getLog().info("deleted {} entries that are older than {}", deleteCount, retainDate);
    }
}
