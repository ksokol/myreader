package myreader.config;

import myreader.repository.SubscriptionEntryRepository;
import myreader.service.search.SubscriptionEntrySearchRepository;
import myreader.service.search.converter.DateConverter;
import myreader.service.search.converter.SearchableSubscriptionEntryConverter;
import myreader.service.search.events.IndexSyncEventHandler;
import myreader.service.search.jobs.IndexSyncJob;
import org.apache.solr.client.solrj.SolrServer;
import org.apache.solr.client.solrj.embedded.EmbeddedSolrServer;
import org.apache.solr.core.ConfigSolr;
import org.apache.solr.core.CoreContainer;
import org.apache.solr.core.SolrResourceLoader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ConversionServiceFactoryBean;
import org.springframework.core.convert.ConversionService;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.solr.core.SolrOperations;
import org.springframework.data.solr.core.SolrTemplate;
import org.springframework.data.solr.core.convert.CustomConversions;
import org.springframework.data.solr.core.convert.MappingSolrConverter;
import org.springframework.data.solr.core.mapping.SimpleSolrMappingContext;
import org.springframework.data.solr.repository.config.EnableSolrRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;

/**
 * @author Kamill Sokol
 */
@Configuration
@EnableTransactionManagement
@EnableSolrRepositories("myreader.service.search")
public class SearchConfig {

    private static final String SOLR_XML = "solr/solr.xml";
    private static final Logger log = LoggerFactory.getLogger(SearchConfig.class);

    @Bean
    public CoreContainer coreContainer() throws IOException {
        File home = new ClassPathResource(SOLR_XML).getFile();
        log.info("looking for cores in " + home.getParent());
        SolrResourceLoader loader = new SolrResourceLoader(home.getParent());
        ConfigSolr config = ConfigSolr.fromSolrHome(loader, loader.getInstanceDir());
        CoreContainer cores = new CoreContainer(loader, config);
        cores.load();
        return cores;
    }

    @Bean
    public SolrServer solrServer() throws IOException {
        return new EmbeddedSolrServer(coreContainer(), "");
    }

	@Bean
	public ConversionServiceFactoryBean conversionService() {
		ConversionServiceFactoryBean conversionServiceFactoryBean = new ConversionServiceFactoryBean();
		conversionServiceFactoryBean.setConverters(Collections.singleton(new SearchableSubscriptionEntryConverter()));
		return conversionServiceFactoryBean;
	}

    @Bean
    public IndexSyncJob indexSyncJob(SubscriptionEntryRepository subscriptionEntryRepository, SubscriptionEntrySearchRepository subscriptionEntrySearchRepository, ConversionService conversionService) {
		return new IndexSyncJob(subscriptionEntryRepository, subscriptionEntrySearchRepository, conversionService);
    }

	@Bean
	public CustomConversions customConversions() {
		/*
		 * Prevent using Solr's date field type.
		 * Solr uses thread local for date formatting. These formatter aren't removed after undeployment causing a memory leak.
		 */
		return new CustomConversions(Arrays.asList(new DateConverter()));
	}

	@Bean
	public MappingSolrConverter mappingSolrConverter() {
		MappingSolrConverter mappingSolrConverter = new MappingSolrConverter(new SimpleSolrMappingContext());
		mappingSolrConverter.setCustomConversions(customConversions());
		return mappingSolrConverter;
	}

    @Bean
    public IndexSyncEventHandler indexSyncEventHandler(IndexSyncJob indexSyncJob) {
        return new IndexSyncEventHandler(indexSyncJob);
    }

	@Bean
	public SolrOperations solrTemplate() throws IOException {
		SolrTemplate solrTemplate = new SolrTemplate(solrServer());
		solrTemplate.setSolrConverter(mappingSolrConverter());
		return solrTemplate;
	}
}
