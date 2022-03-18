package myreader.fetcher.jobs;

import myreader.repository.FetchErrorRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Date;

import static java.lang.System.Logger.Level.INFO;
import static java.util.Objects.requireNonNull;

@Component
@ConditionalOnTaskEnabled
public class FetchErrorCleanerJob extends BaseJob {

  private final int retainDays;
  private final FetchErrorRepository fetchErrorRepository;

  public FetchErrorCleanerJob(@Value("${job.fetchError.retainInDays}") int retainDays, FetchErrorRepository fetchErrorRepository) {
    super("FetchErrorCleanerJob");
    Assert.isTrue(retainDays > 0, "retainDays must be greater than 0");
    this.retainDays = retainDays;
    this.fetchErrorRepository = requireNonNull(fetchErrorRepository, "fetchErrorRepository is null");
  }

  @Scheduled(cron = "0 30 2 * * *")
  @Override
  public void work() {
    var localDate = LocalDate.now().minusDays(retainDays);
    var retainDate = Date.from(localDate.atStartOfDay().toInstant(ZoneOffset.UTC));

    var deleteCount = fetchErrorRepository.retainFetchErrorBefore(retainDate);
    getLogger().log(INFO, "deleted {0} entries that are older than {1}", deleteCount, retainDate);
  }
}
