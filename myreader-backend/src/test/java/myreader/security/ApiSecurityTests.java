package myreader.security;

import myreader.Starter;
import myreader.entity.User;
import myreader.test.WithAuthenticatedUser;
import myreader.test.WithTestProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureTestEntityManager;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.transaction.Transactional;

import static java.util.Collections.singletonList;
import static myreader.config.UrlMappings.LOGIN_PROCESSING;
import static myreader.config.UrlMappings.LOGOUT;
import static myreader.test.TestUser.ADMIN;
import static myreader.test.TestUser.USER1;
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

@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
@AutoConfigureTestEntityManager
@Transactional
// TODO remove me together with test-data.sql
@Sql(statements = {
    "delete from user_feed_entry",
    "delete from exclusion_pattern",
    "delete from user_feed",
    "delete from user_feed_tag",
    "delete from entry",
    "delete from fetch_error",
    "delete from feed",
    "delete from user"
})
@SpringBootTest(classes = { Starter.class, ApiSecurityTests.TestConfiguration.class })
@WithTestProperties
class ApiSecurityTests {

    private static final String API_2 = "/api/2";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TestEntityManager em;

    @BeforeEach
    public void setUp() {
        var user1 = new User(USER1.email);
        user1.setPassword(USER1.passwordHash);
        user1.setRole(USER1.role);
        em.persist(user1);

        var user2 = new User(ADMIN.email);
        user2.setPassword(ADMIN.passwordHash);
        user2.setRole(ADMIN.role);
        em.persist(user2);
    }

    @Test
    void testApiUnauthorizedWithRequestWithAjax() throws Exception {
        mockMvc.perform(get(API_2 + "/sub")
                .with(xmlHttpRequest()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testApiUnauthorized() throws Exception {
        mockMvc.perform(get(API_2 + "/sub"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testSuccessfulUserAuthorization() throws Exception {
        mockMvc.perform(post(LOGIN_PROCESSING.mapping())
                .param("username", USER1.email)
                .param("password", USER1.password))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.roles", is(singletonList("USER"))));
    }

    @Test
    void testSuccessfulAdminAuthorization() throws Exception {
        mockMvc.perform(post(LOGIN_PROCESSING.mapping())
                .param("username", ADMIN.email)
                .param("password", ADMIN.password))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.roles", is(singletonList("ADMIN"))));
    }

    @Test
    void testUnsuccessfulAuthorization() throws Exception {
        mockMvc.perform(post(LOGIN_PROCESSING.mapping())
                .param("username", USER1.email)
                .param("password", "wrong"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testRememberMeWithBrowser() throws Exception {
        var rememberMeCookie = mockMvc.perform(post(LOGIN_PROCESSING.mapping())
                .param("username", USER1.email)
                .param("password", USER1.password))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse().getCookie("remember-me");

        mockMvc.perform(get(API_2 + "/sub")
                .cookie(rememberMeCookie))
                .andExpect(status().isOk());
    }

    @Test
    void testRememberMeWithAjax() throws Exception {
        var rememberMeCookie = mockMvc.perform(post(LOGIN_PROCESSING.mapping())
                .with(xmlHttpRequest())
                .param("username", USER1.email)
                .param("password", USER1.password))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse().getCookie("remember-me");

        mockMvc.perform(get(API_2)
                .cookie(rememberMeCookie))
                .andExpect(status().isOk());
    }

    @Test
    @WithAuthenticatedUser(USER1)
    void testLogoutWithBrowser() throws Exception {
        mockMvc.perform(get(LOGOUT.mapping())
                .accept(TEXT_HTML))
                .andExpect(status().isNoContent())
                .andExpect(cookie().value("JSESSIONID", nullValue()))
                .andExpect(cookie().value("remember-me", nullValue()));
    }

    @Test
    @WithAuthenticatedUser(USER1)
    void testLogoutWithAjax() throws Exception {
        mockMvc.perform(get(LOGOUT.mapping())
                .with(xmlHttpRequest()))
                .andExpect(status().isNoContent())
                .andExpect(cookie().value("JSESSIONID", nullValue()))
                .andExpect(cookie().value("remember-me", nullValue()));
    }

    @Test
    @WithAnonymousUser
    void shouldRejectAccessToActuatorEndpointsWhenUserIsAnonymous() throws Exception {
        mockMvc.perform(get("/info"))
                .andExpect(header().string(HttpHeaders.LOCATION, "http://localhost/"))
                .andExpect(status().isFound());
    }

    @Test
    @WithAuthenticatedUser(USER1)
    void shouldGrantAccessToActuatorEndpointsWhenUserIsAuthenticated() throws Exception {
        mockMvc.perform(get("/info"))
                .andExpect(status().isOk());
    }

    @Test
    @WithAuthenticatedUser(USER1)
    void shouldRejectAccessToProcessingEndpointsWhenUserHasNoAdminRole() throws Exception {
        mockMvc.perform(get(API_2 + "/processing"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithAuthenticatedUser(ADMIN)
    void shouldGrantAccessToProcessingEndpointsWhenUserHasAdminRole() throws Exception {
        mockMvc.perform(get(API_2 + "/processing"))
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
        }
    }
}
