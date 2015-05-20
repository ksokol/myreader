package myreader.config;

import java.io.IOException;
import javax.persistence.EntityManager;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.support.TransactionTemplate;

import myreader.repository.SubscriptionEntryRepositoryImpl;
import myreader.service.search.events.IndexSyncEventHandler;
import myreader.service.search.jobs.IndexSyncJob;

/**
 * @author Kamill Sokol
 */
@Configuration
@EnableJpaRepositories("myreader.repository")
@EnableTransactionManagement
public class PersistenceConfig {

    @Bean
    public IndexSyncEventHandler indexSyncEventHandler(IndexSyncJob indexSyncJob) {
        return new IndexSyncEventHandler(indexSyncJob);
    }

    @Bean
    public SubscriptionEntryRepositoryImpl subscriptionEntryRepositoryImpl(EntityManager em) throws IOException {
        return new SubscriptionEntryRepositoryImpl(em);
    }

    @Bean
    public IndexSyncJob indexSyncJob(EntityManager em, PlatformTransactionManager transactionManager) {
        return new IndexSyncJob(em, new TransactionTemplate(transactionManager));
    }

}
