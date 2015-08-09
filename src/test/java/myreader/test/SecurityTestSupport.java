package myreader.test;

import static myreader.test.KnownUser.USER1;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.gargoylesoftware.htmlunit.BrowserVersion;
import myreader.config.MvcConfig;
import myreader.config.SecurityConfig;
import myreader.entity.User;
import myreader.repository.UserRepository;

import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.encoding.PasswordEncoder;
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
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import com.gargoylesoftware.htmlunit.WebClient;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {SecurityConfig.class, MvcConfig.class, SecurityTestSupport.AdditionalConfig.class})
@WebAppConfiguration
public class SecurityTestSupport {

    public static final String API_2 = "/api/2/irrelevant";

    @EnableWebMvc
    @Configuration
    static class AdditionalConfig extends WebMvcConfigurerAdapter {

        @Bean
        UserRepository userRepository(PasswordEncoder passwordEncoder) {
            User user = new User();
            user.setEmail(USER1.username);
            user.setPassword(passwordEncoder.encodePassword(USER1.password, null));
            user.setRole("ROLE_USER");

            UserRepository userRepository = mock(UserRepository.class);
            when(userRepository.findByEmail(USER1.username)).thenReturn(user);

            return userRepository;
        }

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
