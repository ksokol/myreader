package myreader.test;

import myreader.config.datasource.DataSourceConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;

import javax.sql.DataSource;
import java.util.UUID;

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
        //http://forum.spring.io/forum/spring-projects/data/71251-embedded-datasources-are-not-dropped-when-context-is-destroyed
        dataSource.setUrl(String.format("jdbc:h2:mem:%s;DB_CLOSE_DELAY=-1", UUID.randomUUID().toString()));
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
