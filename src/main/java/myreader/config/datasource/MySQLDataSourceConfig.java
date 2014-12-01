package myreader.config.datasource;

import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.jdbc.datasource.lookup.JndiDataSourceLookup;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;

import javax.sql.DataSource;
import java.util.Properties;

/**
 * @author Kamill Sokol
 */
@Configuration
class MySQLDataSourceConfig implements DataSourceConfig {

    public static final String KEY_DB_USER = "db.user";
    public static final String KEY_DB_PASSWORD = "db.password";
    public static final String KEY_DB_HOST = "db.host";

    private static final String JDBC_DRIVER = "com.mysql.jdbc.Driver";
    private static final String DIALECT = "org.hibernate.dialect.MySQL5InnoDBDialect";
    private static final String HBM_2_DDL_AUTO = "update";

    @Override
    public DataSource dataSource() {
        DataSource dataSource;

        //TODO split into separate configurations
        String user = System.getProperty(KEY_DB_USER);
        String password = System.getProperty(KEY_DB_PASSWORD);
        String host = System.getProperty(KEY_DB_HOST);

        if(user == null|| password == null|| host== null) {
            JndiDataSourceLookup lookup = new JndiDataSourceLookup();
            lookup.setResourceRef(true);
            dataSource = lookup.getDataSource("jdbc/collector");
        } else {
            DriverManagerDataSource dataSource1 = new DriverManagerDataSource();
            dataSource1.setDriverClassName(JDBC_DRIVER);
            dataSource1.setUrl("jdbc:mysql://"+host+"/"+user);
            dataSource1.setUsername(user);
            dataSource1.setPassword(password);
            dataSource = dataSource1;
        }

        return dataSource;
    }

    @Override
    public JpaVendorAdapter jpaVendorAdapter() {
        return new HibernateJpaVendorAdapter() {
            {
                setDatabasePlatform(DIALECT);
                setGenerateDdl(true);
            }
        };
    }

    @Override
    public Properties jpaProperties() {
        Properties properties = new Properties();
        properties.put("hibernate.hbm2ddl.auto", HBM_2_DDL_AUTO);
        return properties;
    }

}
