package myreader.security;

import myreader.Starter;
import myreader.test.ClearDb;
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
import org.springframework.security.test.context.support.WithAnonymousUser;
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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
@AutoConfigureTestEntityManager
@Transactional
@ClearDb
@SpringBootTest(classes = {Starter.class, ApiSecurityTests.TestConfiguration.class})
@WithTestProperties
class ApiSecurityTests {

  private static final String API_2 = "/api/2";

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private TestEntityManager em;

  @BeforeEach
  void setUp() {
    em.persist(USER1.toUser());
    em.persist(ADMIN.toUser());
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
  void shouldRejectAccessToActuatorInfoEndpointsIfUserIsAnonymous() throws Exception {
    mockMvc.perform(get("/info"))
      .andExpect(status().isUnauthorized());
  }

  @Test
  @WithAuthenticatedUser(USER1)
  void shouldGrantAccessToActuatorInfoEndpointsIfUserIsAuthenticated() throws Exception {
    mockMvc.perform(get("/info"))
      .andExpect(status().isOk());
  }

  @Test
  @WithAnonymousUser
  void shouldGrantAccessToActuatorHealthEndpointsIfUserIsAnonymous() throws Exception {
    mockMvc.perform(get("/health"))
      .andExpect(status().isOk());
  }

  @Test
  @WithAuthenticatedUser(USER1)
  void shouldRejectAccessToProcessingEndpointsIfUserHasNoAdminRole() throws Exception {
    mockMvc.perform(get(API_2 + "/processing"))
      .andExpect(status().isForbidden());
  }

  @Test
  @WithAuthenticatedUser(ADMIN)
  void shouldGrantAccessToProcessingEndpointsIfUserHasAdminRole() throws Exception {
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
