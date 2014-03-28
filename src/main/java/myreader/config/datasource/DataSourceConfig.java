package myreader.config.datasource;

import org.springframework.orm.jpa.JpaVendorAdapter;

import javax.sql.DataSource;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
public interface DataSourceConfig {

    DataSource dataSource();

    JpaVendorAdapter jpaVendorAdapter();
}
