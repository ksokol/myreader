package myreader.test;

import myreader.config.datasource.DataSourceConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;

import javax.sql.DataSource;
import java.util.Properties;

/**
 * @author Kamill Sokol
 */
@Configuration
public class TestDataSourceConfig implements DataSourceConfig {

    @Bean
    @Override
    public DataSource dataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName("org.h2.Driver");
        dataSource.setUrl("jdbc:h2:mem:test;DB_CLOSE_DELAY=-1");
        dataSource.setUsername("");
        dataSource.setPassword("");
        return dataSource;
    }

    @Override
    public JpaVendorAdapter jpaVendorAdapter() {
        return  new HibernateJpaVendorAdapter() {
            {
                setDatabasePlatform("org.hibernate.dialect.H2Dialect");
            }
        };
    }

    @Override
    public Properties jpaProperties() {
        Properties properties = new Properties();
        properties.put("hibernate.hbm2ddl.auto","create");
        return properties;
    }

    @Bean
    @DependsOn("entityManagerFactory")
    public ResourceDatabasePopulator initDatabase(DataSource dataSource) throws Exception {
        ResourceDatabasePopulator populator = new ResourceDatabasePopulator();
        populator.addScript(new ClassPathResource("test-data.sql"));
        populator.populate(dataSource.getConnection());
        return populator;
    }
}
