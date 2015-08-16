package myreader.test;

import myreader.Starter;

import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.web.FilterChainProxy;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.htmlunit.MockMvcWebConnection;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.WebApplicationContext;

import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.gargoylesoftware.htmlunit.WebClient;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {Starter.class, SecurityTestSupport.AdditionalConfig.class, TestDataSourceConfig.class})
@WebAppConfiguration
public class SecurityTestSupport {

    public static final String API_2 = "/api/2/irrelevant";

    @Configuration
    static class AdditionalConfig {

        @RestController
        static class TestController {
            @RequestMapping({API_2})
            public void ok() {
            }
        }
    }

    @Autowired
    private FilterChainProxy springSecurityFilterChain;

    @Autowired
    private WebApplicationContext wac;

    protected MockMvc mockMvc;
    protected WebClient webClient;

    @Before
    public void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac)
                .addFilter(springSecurityFilterChain)
                .build();

        webClient = new WebClient(BrowserVersion.FIREFOX_31);
        webClient.setWebConnection(new MockMvcWebConnection(mockMvc));
    }
}
