package myreader.config;

import myreader.config.datasource.DataSourceConfig;
import myreader.entity.listener.ContextAwareEntityListener;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.dao.annotation.PersistenceExceptionTranslationPostProcessor;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.persistence.EntityManagerFactory;

/**
 * @author Kamill Sokol
 */
@Configuration
@EnableJpaRepositories("myreader.repository")
@EnableTransactionManagement
public class PersistenceConfig implements ApplicationContextAware {

    @Autowired
    private DataSourceConfig dataSourceConfig;

    @Bean
    public PersistenceExceptionTranslationPostProcessor exceptionTranslation(){
        return new PersistenceExceptionTranslationPostProcessor();
    }

    @Bean
    public LocalContainerEntityManagerFactoryBean entityManagerFactory() {
        final LocalContainerEntityManagerFactoryBean factoryBean = new LocalContainerEntityManagerFactoryBean();
        factoryBean.setDataSource(dataSourceConfig.dataSource());

        //TODO
        factoryBean.setPackagesToScan(new String[]{"myreader.entity"});
        final JpaVendorAdapter vendorAdapter = dataSourceConfig.jpaVendorAdapter();

        factoryBean.setJpaVendorAdapter(vendorAdapter);
        factoryBean.setJpaProperties(dataSourceConfig.jpaProperties());

        return factoryBean;
    }

    /*
     * don't call entityManagerFactory() otherwise you have a memory leak
     * see https://jira.spring.io/browse/SPR-9274
     */
    @Bean
    public PlatformTransactionManager transactionManager(EntityManagerFactory factory) {
        JpaTransactionManager txManager = new JpaTransactionManager();
        txManager.setEntityManagerFactory(factory);
        return txManager;
    }

	@Override
	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		ContextAwareEntityListener.setApplicationContext(applicationContext);
	}
}
