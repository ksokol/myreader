package myreader.config.datasource;

import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.sql.DataSource;
import java.util.Arrays;
import java.util.List;
import java.util.Properties;

import static myreader.config.datasource.MySQLDataSourceConfig.KEY_DB_HOST;
import static myreader.config.datasource.MySQLDataSourceConfig.KEY_DB_PASSWORD;
import static myreader.config.datasource.MySQLDataSourceConfig.KEY_DB_USER;
import static org.hamcrest.Matchers.instanceOf;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;

@RunWith(value = Parameterized.class)
public class MySQLDataSourceParameterizedConfigTest {

    private MySQLDataSourceConfig uut = new MySQLDataSourceConfig();

    private final String user;
    private final String password;
    private final String host;
    private final Class<DataSource> expectedDataSource;

    public MySQLDataSourceParameterizedConfigTest(final String user, final String password, final String host, final Class<DataSource> expectedDataSource) {
        this.user = user;
        this.password = password;
        this.host = host;
        this.expectedDataSource = expectedDataSource;
    }

    @BeforeClass
    public static void beforeClass() throws Exception {
        createJndiContext();
    }

    @Before
    public void before() {
        removeSystemProperties();
    }

    @Parameterized.Parameters(name = "{index}: {0}, {1}, {2} -> {3}")
    public static List<Object[]> parameters() {
        return Arrays.asList(new Object[][]{
                {null, null, null, MockDataSource.class},
                {"ok", null, null, MockDataSource.class},
                {null, "ok", null, MockDataSource.class},
                {null, null, "ok", MockDataSource.class},
                {"ok", "ok", null, MockDataSource.class},
                {null, "ok", "ok", MockDataSource.class},
                {"ok", null, "ok", MockDataSource.class},
                {"ok", "ok", "ok", DriverManagerDataSource.class}
        });
    }

    @Test
    public void testDataSourceIsInstanceOfDriverManagerDataSource() throws Exception {
        Properties properties = System.getProperties();
        if(user != null)  {
            properties.setProperty(KEY_DB_USER, user);
        }
        if(password != null) {
            properties.setProperty(KEY_DB_PASSWORD, password);
        }
        if(host != null) {
            properties.setProperty(KEY_DB_HOST, host);
        }
        assertThat(uut.dataSource(), instanceOf(expectedDataSource));
    }

    private static void createJndiContext() throws Exception {
        System.setProperty(Context.INITIAL_CONTEXT_FACTORY, "org.apache.naming.java.javaURLContextFactory");
        System.setProperty(Context.URL_PKG_PREFIXES, "org.apache.naming");
        InitialContext ic = new InitialContext();
        ic.createSubcontext("java:");
        ic.createSubcontext("java:comp");
        ic.createSubcontext("java:comp/env");
        ic.createSubcontext("java:comp/env/jdbc");
        ic.bind("java:comp/env/jdbc/collector", mock(MockDataSource.class));
    }
    
    private void removeSystemProperties() {
        Properties properties = System.getProperties();
        properties.remove(KEY_DB_HOST);
        properties.remove(KEY_DB_PASSWORD);
        properties.remove(KEY_DB_USER);
    }

    interface MockDataSource extends DataSource {}

}