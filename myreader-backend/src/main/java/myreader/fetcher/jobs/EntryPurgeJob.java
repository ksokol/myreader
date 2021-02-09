package myreader.fetcher.jobs;

import myreader.fetcher.jobs.purge.EntryPurger;
import myreader.fetcher.jobs.purge.RetainDateDeterminer;
import myreader.repository.SubscriptionRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

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
      getLog().info("start cleaning old entries from feed '{} ({})'", subscription.getTitle(), subscription.getId());
      determiner.determine(subscription).ifPresent(retainDate -> entryPurger.purge(subscription.getId(), retainDate));
      getLog().info("finished cleaning old entries from feed '{} ({})'", subscription.getTitle(), subscription.getId());
    }
  }
}
