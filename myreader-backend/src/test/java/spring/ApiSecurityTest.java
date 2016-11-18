package spring;

import myreader.test.KnownUser;
import myreader.test.SecurityTestSupport;
import org.apache.commons.codec.binary.Base64;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Value;

import javax.servlet.http.Cookie;

import java.nio.charset.Charset;

import static myreader.config.UrlMappings.HYSTRIX;
import static myreader.config.UrlMappings.HYSTRIX_DASHBOARD;
import static myreader.config.UrlMappings.HYSTRIX_PROXY;
import static myreader.config.UrlMappings.HYSTRIX_STREAM;
import static myreader.config.UrlMappings.LOGIN_PROCESSING;
import static myreader.config.UrlMappings.LOGOUT;
import static myreader.test.CustomRequestPostProcessors.sessionUser;
import static myreader.test.CustomRequestPostProcessors.xmlHttpRequest;
import static myreader.test.KnownUser.ADMIN;
import static myreader.test.KnownUser.USER1;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.http.MediaType.TEXT_HTML;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author Kamill Sokol
 */
public class ApiSecurityTest extends SecurityTestSupport {

    @Value("${server.context-path}")
    private String contextPath;

    @Value("${server.port}")
    private String port;

    @Value("${spring.application.name}")
    private String applicationName;

    // used by MyReader Android
    @Test
    public void testApiAccessByBasicAuthentication() throws Exception {
        mockMvc.perform(get(API_2)
                .header("Authorization", basic(USER1)))
                .andExpect(status().isOk())
                .andExpect(header().string("X-MY-AUTHORITIES", "ROLE_USER"));
    }

    @Test
    public void testApiUnauthorizedWithRequestWithAjax() throws Exception {
        mockMvc.perform(get(API_2)
                .with(xmlHttpRequest()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void testApiUnauthorized() throws Exception {
        mockMvc.perform(get(API_2))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void testSuccessfulAuthorization() throws Exception {
        mockMvc.perform(post(LOGIN_PROCESSING.mapping())
                .param("username", USER1.username)
                .param("password", USER1.password))
                .andExpect(status().isNoContent());
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
                .param("password", USER1.password)
                .param("remember-me", "on"))
                .andExpect(status().isNoContent())
                .andReturn()
                .getResponse().getCookie("remember-me");

        mockMvc.perform(get(API_2)
                .cookie(rememberMeCookie))
                .andExpect(status().isOk())
                .andExpect(header().string("X-MY-AUTHORITIES", "ROLE_USER"));
    }

    @Test
    public void testRememberMeWithAjax() throws Exception {
        Cookie rememberMeCookie = mockMvc.perform(post(LOGIN_PROCESSING.mapping())
                .with(xmlHttpRequest())
                .param("username", USER1.username)
                .param("password", USER1.password)
                .param("remember-me", "on"))
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
        mockMvc.perform(get(API_2)
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
    public void testRedirectToHystrixMonitor() throws Exception {
        mockMvc.perform(get(HYSTRIX_DASHBOARD.mapping())
                .with(sessionUser(ADMIN)))
                .andExpect(header().string("Location", "hystrix/monitor?title=" + applicationName + "&stream=http://localhost:" + port + contextPath +"/hystrix.stream"));
    }

    @Test
    public void testHystrixDashboard() throws Exception {
        mockMvc.perform(get("/hystrix/monitor")
                .with(sessionUser(ADMIN)))
                .andExpect(content().string(containsString("Hystrix Monitor")))
                .andExpect(content().contentTypeCompatibleWith(TEXT_HTML));
    }

    @Test
    public void testHystrixStream() throws Exception {
        mockMvc.perform(options(HYSTRIX_STREAM.mapping())
                .with(sessionUser(ADMIN)))
                .andExpect(status().isOk());
    }


    @Test
    public void testHystrixStreamAccessFromLocalhost() throws Exception {
        mockMvc.perform(options(HYSTRIX_STREAM.mapping()))
                .andExpect(status().isOk());
    }

    @Test
    public void testRejectAccessToHystrixDashboardWhenUserIsNotAdmin() throws Exception {
        mockMvc.perform(get(HYSTRIX_DASHBOARD.mapping())
                .with(sessionUser(USER1)))
                .andExpect(status().isForbidden());
    }

    @Test
    public void testHystrixProxyStream() throws Exception {
        mockMvc.perform(get(HYSTRIX_PROXY.mapping())
                .with(sessionUser(ADMIN)))
                .andExpect(status().isOk());
    }

    @Test
    public void testHystrix() throws Exception {
        mockMvc.perform(get(HYSTRIX_PROXY.mapping())
                .with(sessionUser(ADMIN)))
                .andExpect(status().isOk());
    }

    @Test
    public void testRejectAccessToHystrix() throws Exception {
        mockMvc.perform(get(HYSTRIX.mapping())
                .with(sessionUser(USER1)))
                .andExpect(status().isForbidden());
    }

    @Test
    public void testRejectAccessToHystrixWithSubpath() throws Exception {
        mockMvc.perform(get(HYSTRIX.mapping() + "/subpath")
                .with(sessionUser(USER1)))
                .andExpect(status().isForbidden());
    }

    @Test
    public void testRejectAccessToHystrixProxyStreamWhenUserIsNotAdmin() throws Exception {
        mockMvc.perform(options(HYSTRIX.mapping())
                .with(sessionUser(USER1)))
                .andExpect(status().isForbidden());
    }

    private static String basic(KnownUser user) {
        final byte[] usernamePassword = String.format("%s:%s", user.username, user.password).getBytes(Charset.forName("UTF-8"));
        return "Basic " + new String(Base64.encodeBase64(usernamePassword), Charset.forName("UTF-8"));
    }
}
