package myreader.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.dao.annotation.PersistenceExceptionTranslationPostProcessor;
import org.springframework.dao.support.PersistenceExceptionTranslator;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.jdbc.datasource.LazyConnectionDataSourceProxy;
import org.springframework.jdbc.datasource.TransactionAwareDataSourceProxy;
import org.springframework.jdbc.datasource.init.DataSourceInitializer;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.jndi.JndiObjectFactoryBean;
import org.springframework.orm.hibernate4.HibernateExceptionTranslator;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;

/**
 * @author dev@sokol-web.de <Kamill Sokol>
 */
@Configuration
@EnableTransactionManagement
public class PersistenceConfig {

    @Value("${driverClass:com.mysql.jdbc.Driver}")
    private String driverClassName;

    private boolean jpaGenerateDdl = true;

    @Value("${dialect:org.hibernate.dialect.MySQL5InnoDBDialect}")
    private String hibernateDialect;

    @Value("${db.user}")
    private String username;

    @Value("${db.password}")
    private String password;

    @Value("${hibernateHbm2ddlAuto:false}")
    private String hibernateHbm2ddlAuto;

    @Bean
    public DataSource dataSource() {
        DataSource dataSource;

        String user = System.getProperty("db.user");
        String password = System.getProperty("db.password");
        String host = System.getProperty("db.host");

        if(user == null|| password == null|| host== null) {
            JndiObjectFactoryBean jndiObjectFactoryBean = new JndiObjectFactoryBean();
            jndiObjectFactoryBean.setJndiName("java:comp/env/jdbc/collector");
            dataSource = (DataSource) jndiObjectFactoryBean.getObject();
        } else {
            DriverManagerDataSource dataSource1 = new DriverManagerDataSource();
            dataSource1.setDriverClassName("com.mysql.jdbc.Driver");
            dataSource1.setUrl("jdbc:mysql://"+host+"/"+user);
            dataSource1.setUsername(user);
            dataSource1.setPassword(password);
            dataSource = dataSource1;
        }

        return dataSource;
    }

    @Bean
    public PersistenceExceptionTranslationPostProcessor exceptionTranslation(){
        return new PersistenceExceptionTranslationPostProcessor();
    }
    //@Bean
    public PersistenceExceptionTranslator hibernateExceptionTranslator() {
        return new HibernateExceptionTranslator();
    }

    @Bean
    public LocalContainerEntityManagerFactoryBean entityManagerFactoryBean() {
        final LocalContainerEntityManagerFactoryBean factoryBean = new LocalContainerEntityManagerFactoryBean();
        factoryBean.setDataSource(dataSource());
        factoryBean.setPackagesToScan(new String[]{"myreader.entity"});

        final JpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter() {
            {

                setDatabasePlatform(hibernateDialect);
                setGenerateDdl(jpaGenerateDdl);
                setShowSql(true);
            }
        };

        factoryBean.setJpaVendorAdapter(vendorAdapter);

        //factoryBean.setJpaProperties(additionlProperties());

        return factoryBean;
    }

    @Bean
    public JpaTransactionManager transactionManager() {
        final JpaTransactionManager transactionManager = new JpaTransactionManager();
        transactionManager.setEntityManagerFactory(entityManagerFactoryBean().getObject());

        return transactionManager;
    }



}
