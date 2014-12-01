package myreader.config.datasource;

import org.hamcrest.Matchers;
import org.junit.Test;
import org.springframework.orm.jpa.JpaVendorAdapter;

import java.util.Map;
import java.util.Properties;

import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;

public class MySQLDataSourceConfigTest {

    private static final String KEY_HIBERNATE_HBM2DDL_AUTO = "hibernate.hbm2ddl.auto";
    private static final String KEY_HIBERNATE_DIALECT = "hibernate.dialect";
    private MySQLDataSourceConfig uut = new MySQLDataSourceConfig();

    @Test
    public void testJpaVendorAdapter() throws Exception {
        JpaVendorAdapter jpaVendorAdapter = uut.jpaVendorAdapter();
        Map<String, ?> jpaPropertyMap = jpaVendorAdapter.getJpaPropertyMap();

        assertThat(jpaPropertyMap.keySet(), contains(KEY_HIBERNATE_HBM2DDL_AUTO, KEY_HIBERNATE_DIALECT));
        assertThat(jpaPropertyMap.get(KEY_HIBERNATE_HBM2DDL_AUTO), Matchers.<Object>is("update"));
        assertThat(jpaPropertyMap.get(KEY_HIBERNATE_DIALECT), Matchers.<Object>is("org.hibernate.dialect.MySQL5InnoDBDialect"));
    }

    @Test
    public void testJpaProperties() throws Exception {
        Properties properties = uut.jpaProperties();

        assertThat(properties.getProperty(KEY_HIBERNATE_HBM2DDL_AUTO), notNullValue());
        assertThat(properties.get(KEY_HIBERNATE_HBM2DDL_AUTO), Matchers.<Object>is("update"));
    }

}