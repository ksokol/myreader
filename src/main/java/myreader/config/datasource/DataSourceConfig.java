package myreader.config.datasource;

import org.springframework.orm.jpa.JpaVendorAdapter;

import javax.sql.DataSource;
import java.util.Properties;

/**
 * @author Kamill Sokol
 */
public interface DataSourceConfig {

    DataSource dataSource();

    JpaVendorAdapter jpaVendorAdapter();

    Properties jpaProperties();
}
