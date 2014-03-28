package myreader.test;

import myreader.config.datasource.DataSourceConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;

import javax.sql.DataSource;

/**
 * @author Kamill Sokol dev@sokol-web.de
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
                setGenerateDdl(true);
                setShowSql(true);
            }
        };
    }
}
