package myreader.config.datasource;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.jdbc.datasource.lookup.JndiDataSourceLookup;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;

import javax.sql.DataSource;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
@Configuration
class MySQLDataSourceConfig implements DataSourceConfig {

    @Value("${driverClass:com.mysql.jdbc.Driver}")
    private String driverClassName;

    private boolean jpaGenerateDdl = true;

    @Value("${dialect:org.hibernate.dialect.MySQL5InnoDBDialect}")
    private String hibernateDialect;

    //  @Value("${db.user}")
    private String username;

    //@Value("${db.password}")
    private String password;

    @Value("${hibernateHbm2ddlAuto:false}")
    private String hibernateHbm2ddlAuto;

    @Override
    public DataSource dataSource() {
        DataSource dataSource;

        //TODO split into separate configurations
        String user = System.getProperty("db.user");
        String password = System.getProperty("db.password");
        String host = System.getProperty("db.host");

        if(user == null|| password == null|| host== null) {
            JndiDataSourceLookup lookup = new JndiDataSourceLookup();
            lookup.setResourceRef(true);
            dataSource = lookup.getDataSource("jdbc/collector");
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

    @Override
    public JpaVendorAdapter jpaVendorAdapter() {
        return new HibernateJpaVendorAdapter() {
            {
                setDatabasePlatform(hibernateDialect);
                setGenerateDdl(jpaGenerateDdl);
                setShowSql(true);
            }
        };
    }
}
