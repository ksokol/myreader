package myreader.test;

import myreader.Starter;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.web.FilterChainProxy;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.WebApplicationContext;

/**
 * @author Kamill Sokol
 */

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = {Starter.class, SecurityTestSupport.AdditionalConfig.class, TestDataSourceConfig.class})
@WebAppConfiguration
public abstract class SecurityTestSupport {

    private static final String HYSTRIX_PROXY = "/proxy.stream";

    protected static final String API_2 = "/api/2/irrelevant";

    @Autowired
    private FilterChainProxy springSecurityFilterChain;

    @Autowired
    private WebApplicationContext wac;

    protected MockMvc mockMvc;

    @Before
    public void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac)
                .addFilter(springSecurityFilterChain)
                .build();
    }

    @Configuration
    static class AdditionalConfig {

        @RestController
        static class TestController {
            @RequestMapping({API_2, HYSTRIX_PROXY})
            public void ok() {
                //returns 200
            }
        }
    }
}
