package myreader.service.search.jobs;

import java.util.List;

import myreader.entity.SearchableSubscriptionEntry;
import myreader.entity.SubscriptionEntry;
import myreader.repository.SubscriptionEntryRepository;
import myreader.service.search.SubscriptionEntrySearchRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.core.convert.ConversionService;
import org.springframework.core.convert.TypeDescriptor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.TransactionCallbackWithoutResult;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.util.Assert;

/**
 * TODO IndexSyncJob and SyndFetcherJob should be running exclusively. this prevents duplicate entries in index
 *
 * @author Kamill Sokol
 */
public class IndexSyncJob implements Runnable, ApplicationListener<ContextClosedEvent> {
    private static final Logger log = LoggerFactory.getLogger(IndexSyncJob.class);

    private int pageSize = 1000;
    private final SubscriptionEntryRepository subscriptionEntryRepository;
	private final SubscriptionEntrySearchRepository subscriptionEntrySearchRepository;
	private final ConversionService conversionService;
    private final TransactionTemplate transactionTemplate;

    private volatile boolean alive = true;

    public IndexSyncJob(SubscriptionEntryRepository subscriptionEntryRepository, SubscriptionEntrySearchRepository subscriptionEntrySearchRepository, ConversionService conversionService, TransactionTemplate transactionTemplate) {
        this.subscriptionEntryRepository = subscriptionEntryRepository;
		this.subscriptionEntrySearchRepository = subscriptionEntrySearchRepository;
		this.conversionService = conversionService;
        this.transactionTemplate = transactionTemplate;
    }

	@Override
	public void run() {
		try {
			runInternal();
		} catch (Exception e) {
			log.error("error during index sync", e);
		}
	}

    private void runInternal() {
        transactionTemplate.execute(new TransactionCallbackWithoutResult() {
            @Override
            protected void doInTransactionWithoutResult(TransactionStatus status) {
                log.info("start");
                subscriptionEntrySearchRepository.deleteAll();

                int pageNumber = 0;
                Page<SubscriptionEntry> page;
                List<SearchableSubscriptionEntry> converted;

                do {
                    page = subscriptionEntryRepository.findAll(new PageRequest(pageNumber++, pageSize));
                    converted = convert(page.getContent());
                    subscriptionEntrySearchRepository.save(converted);
                } while(page.hasNext() && alive);


                log.info("search index sync done");
                log.info("end");
            }
        });
    }

	public int getPageSize() {
		return pageSize;
	}

	public void setPageSize(int pageSize) {
		Assert.isTrue(pageSize > 0);
		this.pageSize = pageSize;
	}

	private List<SearchableSubscriptionEntry> convert(List<SubscriptionEntry> source) {
		TypeDescriptor sourceType = TypeDescriptor.collection(List.class, TypeDescriptor.valueOf(SubscriptionEntry.class));
		TypeDescriptor targetType = TypeDescriptor.collection(List.class, TypeDescriptor.valueOf(SearchableSubscriptionEntry.class));
		return (List<SearchableSubscriptionEntry>) conversionService.convert(source, sourceType, targetType);
	}

    @Override
    public void onApplicationEvent(ContextClosedEvent event) {
        log.info("got stop signal");
        alive = false;
    }
}
