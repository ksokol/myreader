package spring;

import myreader.Starter;
import myreader.test.KnownUser;
import myreader.test.TestDataSourceConfig;
import org.apache.commons.codec.binary.Base64;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.Cookie;
import java.nio.charset.Charset;

import static myreader.config.UrlMappings.LOGIN_PROCESSING;
import static myreader.config.UrlMappings.LOGOUT;
import static myreader.test.CustomRequestPostProcessors.sessionUser;
import static myreader.test.CustomRequestPostProcessors.xmlHttpRequest;
import static myreader.test.KnownUser.ADMIN;
import static myreader.test.KnownUser.USER1;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.http.MediaType.TEXT_HTML;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@SpringBootTest(classes = {Starter.class, ApiSecurityTest.AdditionalConfig.class, TestDataSourceConfig.class})
@TestPropertySource(properties = { "task.enabled = false" })
public class ApiSecurityTest {

    private static final String API_2 = "/api/2";

    @Autowired
    private MockMvc mockMvc;

    // used by MyReader Android
    @Test
    public void testApiAccessByBasicAuthentication() throws Exception {
        mockMvc.perform(get(API_2 + "/sub")
                .header("Authorization", basic(USER1)))
                .andExpect(status().isOk())
                .andExpect(header().string("X-MY-AUTHORITIES", "ROLE_USER"));
    }

    @Test
    public void testApiUnauthorizedWithRequestWithAjax() throws Exception {
        mockMvc.perform(get(API_2 + "/sub")
                .with(xmlHttpRequest()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void testApiUnauthorized() throws Exception {
        mockMvc.perform(get(API_2 + "/sub"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void testSuccessfulAuthorization() throws Exception {
        mockMvc.perform(post(LOGIN_PROCESSING.mapping())
                .param("username", USER1.username)
                .param("password", USER1.password))
                .andExpect(status().isNoContent())
                .andExpect(header().string("X-MY-AUTHORITIES","ROLE_USER"));
    }

    @Test
    public void testUnsuccessfulAuthorization() throws Exception {
        mockMvc.perform(post(LOGIN_PROCESSING.mapping())
                .param("username", USER1.username)
                .param("password", "wrong"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void testRememberMeWithBrowser() throws Exception {
        Cookie rememberMeCookie = mockMvc.perform(post(LOGIN_PROCESSING.mapping())
                .param("username", USER1.username)
                .param("password", USER1.password))
                .andExpect(status().isNoContent())
                .andReturn()
                .getResponse().getCookie("remember-me");

        mockMvc.perform(get(API_2 + "/sub")
                .cookie(rememberMeCookie))
                .andExpect(status().isOk())
                .andExpect(header().string("X-MY-AUTHORITIES", "ROLE_USER"));
    }

    @Test
    public void testRememberMeWithAjax() throws Exception {
        Cookie rememberMeCookie = mockMvc.perform(post(LOGIN_PROCESSING.mapping())
                .with(xmlHttpRequest())
                .param("username", USER1.username)
                .param("password", USER1.password))
                .andExpect(status().isNoContent())
                .andReturn()
                .getResponse().getCookie("remember-me");

        mockMvc.perform(get(API_2)
                .cookie(rememberMeCookie))
                .andExpect(status().isOk())
                .andExpect(header().string("X-MY-AUTHORITIES", "ROLE_USER"));
    }

    @Test
    public void testApiOk() throws Exception {
        mockMvc.perform(get(API_2 + "/sub")
                .with(sessionUser(USER1)))
                .andExpect(status().isOk())
                .andExpect(header().string("X-MY-AUTHORITIES", "ROLE_USER"));
    }

    @Test
    public void testLogoutWithBrowserRememberMe() throws Exception {
        mockMvc.perform(get(LOGOUT.mapping())
                .with(sessionUser(USER1))
                .accept(TEXT_HTML))
                .andExpect(status().isNoContent())
                .andExpect(cookie().value("JSESSIONID", nullValue()))
                .andExpect(cookie().value("remember-me", nullValue()));
    }

    @Test
    public void testLogoutWithBrowser() throws Exception {
        mockMvc.perform(get(LOGOUT.mapping())
                .with(sessionUser(USER1))
                .accept(TEXT_HTML))
                .andExpect(status().isNoContent())
                .andExpect(cookie().value("JSESSIONID", nullValue()));
    }

    @Test
    public void testLogoutWithAjax() throws Exception {
        mockMvc.perform(get(LOGOUT.mapping())
                .with(xmlHttpRequest())
                .with(sessionUser(USER1)))
                .andExpect(status().isNoContent())
                .andExpect(cookie().value("JSESSIONID", nullValue()))
                .andExpect(cookie().value("remember-me", nullValue()));
    }

    @Test
    public void shouldRejectAccessToActuatorEndpointsWhenUserIsAnonymous() throws Exception {
        mockMvc.perform(get("/info"))
                .andExpect(header().string(HttpHeaders.LOCATION, "http://localhost/"))
                .andExpect(status().isFound());
    }

    @Test
    public void shouldGrantAccessToActuatorEndpointsWhenUserIsAuthenticated() throws Exception {
        mockMvc.perform(get("/info")
                .with(sessionUser(USER1)))
                .andExpect(status().isOk());
    }

    @Test
    public void shouldRejectAccessToProcessingEndpointsWhenUserHasNoAdminRole() throws Exception {
        mockMvc.perform(get(API_2 + "/processing")
                .with(sessionUser(USER1)))
                .andExpect(status().isForbidden());
    }

    @Test
    public void shouldGrantAccessToProcessingEndpointsWhenUserHasAdminRole() throws Exception {
        mockMvc.perform(get(API_2 + "/processing")
                .with(sessionUser(ADMIN)))
                .andExpect(status().isOk());
    }

    @Test
    public void shouldRejectAccessToFeedsEndpointsWhenUserHasNoAdminRole() throws Exception {
        mockMvc.perform(get(API_2 + "/feeds")
                .with(sessionUser(USER1)))
                .andExpect(status().isForbidden());
    }

    @Test
    public void shouldGranAccessToFeedsEndpointsWhenUserHasAdminRole() throws Exception {
        mockMvc.perform(get(API_2 + "/feeds")
                .with(sessionUser(ADMIN)))
                .andExpect(status().isOk());
    }

    @Test
    public void shouldRejectAccessToFeedsSubEndpointsWhenUserHasNoAdminRole() throws Exception {
        mockMvc.perform(get(API_2 + "/feeds/sub1/sub2")
                .with(sessionUser(USER1)))
                .andExpect(status().isForbidden());
    }

    @Test
    public void shouldGrantAccessToFeedsSubEndpointsWhenUserHasAdminRole() throws Exception {
        mockMvc.perform(get(API_2 + "/feeds/sub1/sub2")
                .with(sessionUser(ADMIN)))
                .andExpect(status().isOk());
    }

    private static String basic(KnownUser user) {
        final byte[] usernamePassword = String.format("%s:%s", user.username, user.password).getBytes(Charset.forName("UTF-8"));
        return "Basic " + new String(Base64.encodeBase64(usernamePassword), Charset.forName("UTF-8"));
    }

    @Configuration
    static class AdditionalConfig {

        @RestController
        static class TestController {
            @RequestMapping(API_2 + "/sub")
            public void sub() {
                //returns 200
            }

            @RequestMapping(API_2 + "/processing")
            public void processing() {
                //returns 200
            }

            @RequestMapping(API_2 + "/feeds")
            public void feeds() {
                //returns 200
            }

            @RequestMapping(API_2 + "/feeds/sub1/sub2")
            public void feedsSub1Sub2() {
                //returns 200
            }
        }
    }
}
