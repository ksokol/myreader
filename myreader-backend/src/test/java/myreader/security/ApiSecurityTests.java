package myreader.security;

import myreader.Starter;
import myreader.test.WithTestProperties;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Configuration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
@SpringBootTest(classes = {Starter.class, ApiSecurityTests.TestConfiguration.class})
@WithTestProperties
class ApiSecurityTests {

  private static final String API_2 = "/api/2";
  private static final String VIEWS = "/views";
  private static final String CHECK = "/check";
  private static final String PASSWORD = "user";

  @Autowired
  private MockMvc mockMvc;

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
  void testViewsUnauthorizedWithRequestWithAjax() throws Exception {
    mockMvc.perform(get(VIEWS + "/sub")
      .with(xmlHttpRequest()))
      .andExpect(status().isUnauthorized());
  }

  @Test
  void testViewsUnauthorized() throws Exception {
    mockMvc.perform(get(VIEWS + "/sub"))
      .andExpect(status().isUnauthorized());
  }

  @Test
  void testSuccessfulUserAuthorization() throws Exception {
    mockMvc.perform(post(CHECK)
      .param("password", PASSWORD))
      .andExpect(status().isNoContent());
  }

  @Test
  void testUnsuccessfulAuthorization() throws Exception {
    mockMvc.perform(post(CHECK)
      .param("password", "wrong"))
      .andExpect(status().isBadRequest());
  }

  @Test
  void testApiRememberMeWithBrowser() throws Exception {
    var rememberMeCookie = mockMvc.perform(post(CHECK)
      .param("password", PASSWORD))
      .andExpect(status().isNoContent())
      .andReturn()
      .getResponse().getCookie("remember-me");

    mockMvc.perform(get(API_2 + "/sub")
      .cookie(rememberMeCookie))
      .andExpect(status().isOk());
  }

  @Test
  void testApiRememberMeWithAjax() throws Exception {
    var rememberMeCookie = mockMvc.perform(post(CHECK)
      .with(xmlHttpRequest())
      .param("password", PASSWORD))
      .andExpect(status().isNoContent())
      .andReturn()
      .getResponse().getCookie("remember-me");

    mockMvc.perform(get(API_2 + "/sub")
      .cookie(rememberMeCookie))
      .andExpect(status().isOk());
  }

  @Test
  void testViewsRememberMeWithBrowser() throws Exception {
    var rememberMeCookie = mockMvc.perform(post(CHECK)
      .param("password", PASSWORD))
      .andExpect(status().isNoContent())
      .andReturn()
      .getResponse().getCookie("remember-me");

    mockMvc.perform(get(VIEWS + "/sub")
      .cookie(rememberMeCookie))
      .andExpect(status().isOk());
  }

  @Test
  void testViewsRememberMeWithAjax() throws Exception {
    var rememberMeCookie = mockMvc.perform(post(CHECK)
      .with(xmlHttpRequest())
      .param("password", PASSWORD))
      .andExpect(status().isNoContent())
      .andReturn()
      .getResponse().getCookie("remember-me");

    mockMvc.perform(get(VIEWS + "/sub")
      .cookie(rememberMeCookie))
      .andExpect(status().isOk());
  }

  @Configuration
  static class TestConfiguration {

    @RestController
    static class TestController {
      @RequestMapping(API_2 + "/sub")
      public void api() {
        //returns 200
      }
      @RequestMapping(VIEWS + "/sub")
      public void views() {
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
