package myreader.security;

import myreader.Starter;
import myreader.test.TestConstants;
import myreader.test.WithTestProperties;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.Cookie;

import static java.util.Collections.singletonList;
import static myreader.config.UrlMappings.LOGIN_PROCESSING;
import static myreader.config.UrlMappings.LOGOUT;
import static myreader.test.request.RequestedWithHeaderPostProcessors.xmlHttpRequest;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.http.MediaType.TEXT_HTML;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author Kamill Sokol
 */
@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@Sql("classpath:test-data.sql")
@SpringBootTest(classes = { Starter.class, ApiSecurityTests.TestConfiguration.class })
@WithTestProperties
public class ApiSecurityTests {

    private static final String API_2 = "/api/2";

    @Autowired
    private MockMvc mockMvc;

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
    public void testSuccessfulUserAuthorization() throws Exception {
        mockMvc.perform(post(LOGIN_PROCESSING.mapping())
                .param("username", TestConstants.USER1)
                .param("password", TestConstants.DEFAULT_PASSWORD))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.roles", is(singletonList("USER"))));
    }

    @Test
    public void testSuccessfulAdminAuthorization() throws Exception {
        mockMvc.perform(post(LOGIN_PROCESSING.mapping())
                .param("username", TestConstants.USER0)
                .param("password", TestConstants.DEFAULT_PASSWORD))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.roles", is(singletonList("ADMIN"))));
    }

    @Test
    public void testUnsuccessfulAuthorization() throws Exception {
        mockMvc.perform(post(LOGIN_PROCESSING.mapping())
                .param("username", TestConstants.USER1)
                .param("password", "wrong"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testRememberMeWithBrowser() throws Exception {
        Cookie rememberMeCookie = mockMvc.perform(post(LOGIN_PROCESSING.mapping())
                .param("username", TestConstants.USER1)
                .param("password", TestConstants.DEFAULT_PASSWORD))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse().getCookie("remember-me");

        mockMvc.perform(get(API_2 + "/sub")
                .cookie(rememberMeCookie))
                .andExpect(status().isOk());
    }

    @Test
    public void testRememberMeWithAjax() throws Exception {
        Cookie rememberMeCookie = mockMvc.perform(post(LOGIN_PROCESSING.mapping())
                .with(xmlHttpRequest())
                .param("username", TestConstants.USER1)
                .param("password", TestConstants.DEFAULT_PASSWORD))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse().getCookie("remember-me");

        mockMvc.perform(get(API_2)
                .cookie(rememberMeCookie))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(TestConstants.USER1)
    public void testLogoutWithBrowser() throws Exception {
        mockMvc.perform(get(LOGOUT.mapping())
                .accept(TEXT_HTML))
                .andExpect(status().isNoContent())
                .andExpect(cookie().value("JSESSIONID", nullValue()))
                .andExpect(cookie().value("remember-me", nullValue()));
    }

    @Test
    @WithMockUser(TestConstants.USER1)
    public void testLogoutWithAjax() throws Exception {
        mockMvc.perform(get(LOGOUT.mapping())
                .with(xmlHttpRequest()))
                .andExpect(status().isNoContent())
                .andExpect(cookie().value("JSESSIONID", nullValue()))
                .andExpect(cookie().value("remember-me", nullValue()));
    }

    @Test
    @WithAnonymousUser
    public void shouldRejectAccessToActuatorEndpointsWhenUserIsAnonymous() throws Exception {
        mockMvc.perform(get("/info"))
                .andExpect(header().string(HttpHeaders.LOCATION, "http://localhost/"))
                .andExpect(status().isFound());
    }

    @Test
    @WithMockUser(TestConstants.USER1)
    public void shouldGrantAccessToActuatorEndpointsWhenUserIsAuthenticated() throws Exception {
        mockMvc.perform(get("/info"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(TestConstants.USER1)
    public void shouldRejectAccessToProcessingEndpointsWhenUserHasNoAdminRole() throws Exception {
        mockMvc.perform(get(API_2 + "/processing"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = TestConstants.ADMIN, roles = "ADMIN")
    public void shouldGrantAccessToProcessingEndpointsWhenUserHasAdminRole() throws Exception {
        mockMvc.perform(get(API_2 + "/processing"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(TestConstants.USER1)
    public void shouldRejectAccessToFeedsEndpointsWhenUserHasNoAdminRole() throws Exception {
        mockMvc.perform(get(API_2 + "/feeds"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = TestConstants.ADMIN, roles = "ADMIN")
    public void shouldGranAccessToFeedsEndpointsWhenUserHasAdminRole() throws Exception {
        mockMvc.perform(get(API_2 + "/feeds"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(value = TestConstants.USER1)
    public void shouldRejectAccessToFeedsSubEndpointsWhenUserHasNoAdminRole() throws Exception {
        mockMvc.perform(get(API_2 + "/feeds/sub1/sub2"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = TestConstants.ADMIN, roles = "ADMIN")
    public void shouldGrantAccessToFeedsSubEndpointsWhenUserHasAdminRole() throws Exception {
        mockMvc.perform(get(API_2 + "/feeds/sub1/sub2"))
                .andExpect(status().isOk());
    }

    @Configuration
    static class TestConfiguration {

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
