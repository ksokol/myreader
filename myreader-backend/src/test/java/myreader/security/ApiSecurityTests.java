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
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.transaction.Transactional;

import static myreader.config.UrlMappings.LOGIN_PROCESSING;
import static myreader.test.TestUser.USER1;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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
      .andExpect(status().isNoContent());
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
      .andExpect(status().isNoContent())
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
      .andExpect(status().isNoContent())
      .andReturn()
      .getResponse().getCookie("remember-me");

    mockMvc.perform(get(API_2 + "/sub")
      .cookie(rememberMeCookie))
      .andExpect(status().isOk());
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

  @Configuration
  static class TestConfiguration {

    @RestController
    static class TestController {
      @RequestMapping(API_2 + "/sub")
      public void sub() {
        //returns 200
      }
    }
  }

  private static RequestPostProcessor xmlHttpRequest() {
    return request -> {
      request.addHeader("X-Requested-With", "XMLHttpRequest");
      return request;
    };
  }
}
