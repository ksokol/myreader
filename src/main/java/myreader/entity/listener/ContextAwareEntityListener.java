package myreader.entity.listener;

import myreader.service.search.SubscriptionEntrySearchRepository;
import org.springframework.context.ApplicationContext;
import org.springframework.core.convert.ConversionService;
import org.springframework.util.Assert;

/**
 * @author Kamill Sokol
 */
public class ContextAwareEntityListener {

	private static ApplicationContext CONTEXT;

	public ContextAwareEntityListener() {
		Assert.notNull(CONTEXT);
	}

	protected ConversionService getConversionService() {
		return CONTEXT.getBean("conversionService", ConversionService.class);
	}

	protected SubscriptionEntrySearchRepository getSubscriptionEntrySearchRepository() {
		return CONTEXT.getBean(SubscriptionEntrySearchRepository.class);
	}

	public static void setApplicationContext(ApplicationContext applicationContext) {
		CONTEXT = applicationContext;
	}

}
