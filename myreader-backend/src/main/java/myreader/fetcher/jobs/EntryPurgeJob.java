package myreader.fetcher.jobs;

import myreader.fetcher.jobs.purge.EntryPurger;
import myreader.fetcher.jobs.purge.RetainDateDeterminer;
import myreader.repository.SubscriptionRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import static java.lang.System.Logger.Level.INFO;

@Component
@ConditionalOnTaskEnabled
public class EntryPurgeJob extends BaseJob {

  private final SubscriptionRepository subscriptionRepository;
  private final EntryPurger entryPurger;
  private final RetainDateDeterminer determiner;

  public EntryPurgeJob(SubscriptionRepository subscriptionRepository, EntryPurger entryPurger, RetainDateDeterminer determiner) {
    super("entryPurgeJob");
    this.subscriptionRepository = subscriptionRepository;
    this.entryPurger = entryPurger;
    this.determiner = determiner;
  }

  @Scheduled(cron = "0 33 3 * * *")
  @Override
  public void work() {
    var subscriptions = subscriptionRepository.findAll();

    for (var subscription : subscriptions) {
      getLogger().log(INFO, "start cleaning old entries from feed '{0} ({1})'", subscription.getTitle(), subscription.getId());
      determiner.determine(subscription).ifPresent(retainDate -> entryPurger.purge(subscription.getId(), retainDate));
      getLogger().log(INFO, "finished cleaning old entries from feed '{0} ({1})'", subscription.getTitle(), subscription.getId());
    }
  }
}
