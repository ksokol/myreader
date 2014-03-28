package myreader.resource.user;

import myreader.config.PersistenceConfig;
import myreader.config.SecurityConfig;
import myreader.resource.ResourceConfig;
import myreader.service.subscriptionentry.SubscriptionEntryService;
import myreader.test.TestConfig;
import myreader.test.TestDataSourceConfig;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.context.WebApplicationContext;

import javax.servlet.Filter;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuildersWithAuthenticatedUserSupport.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {ResourceConfig.class, PersistenceConfig.class, TestDataSourceConfig.class, TestConfig.class, SecurityConfig.class})
@WebAppConfiguration
public class UserCollectionResourceTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext wac;

    @Autowired
    private SubscriptionEntryService mock;

    @Autowired
    private Filter springSecurityFilterChain;

    @Before
    public void setUp() throws Exception {

        this.mockMvc = webAppContextSetup(this.wac)
                .addFilter(springSecurityFilterChain)
                .build();
    }

    @After
    public void tearDown() throws Exception {

    }

    @Test
    public void testFindBySubscription() throws Exception {
        mockMvc.perform(getAsAdmin("/users"))
                .andExpect(status().isOk()).andDo(print())
                .andExpect(jsonPath("$.page.totalElements", is(3)));

    }

    @Test
    public void testFindBySubscription2() throws Exception {
        mockMvc.perform(getAsUser1("/users"))
                .andExpect(status().isOk()).andDo(print())
                .andExpect(jsonPath("$.page.totalElements", is(1)));

    }
}
