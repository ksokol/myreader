package myreader.config;

import myreader.repository.SubscriptionEntryRepositoryImpl;
import myreader.service.search.jobs.IndexSyncJob;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.data.repository.query.SecurityEvaluationContextExtension;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.support.TransactionTemplate;

import java.io.IOException;
import javax.persistence.EntityManager;

/**
 * @author Kamill Sokol
 */
@Configuration
@EnableTransactionManagement
public class PersistenceConfig {

    @Bean
    public SubscriptionEntryRepositoryImpl subscriptionEntryRepositoryImpl(EntityManager em) throws IOException {
        return new SubscriptionEntryRepositoryImpl(em);
    }

    @Bean
    public IndexSyncJob indexSyncJob(EntityManager em, PlatformTransactionManager transactionManager) {
        return new IndexSyncJob("indexSyncJob", em, new TransactionTemplate(transactionManager));
    }

    @Bean
    public SecurityEvaluationContextExtension securityEvaluationContextExtension() {
        return new SecurityEvaluationContextExtension();
    }
}
