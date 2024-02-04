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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static myreader.test.request.AuthorizationPostProcessors.authorization;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
@SpringBootTest(classes = {Starter.class, ApiSecurityTests.TestConfiguration.class})
@WithTestProperties
class ApiSecurityTests {

  private static final String API_2 = "/api/2";
  private static final String VIEWS = "/views";

  @Autowired
  private MockMvc mockMvc;

  @Test
  void testPublicUrls() throws Exception {
    mockMvc.perform(get("/"))
      .andExpect(status().isOk());

    mockMvc.perform(get("/index.html"))
      .andExpect(status().isOk());

    mockMvc.perform(get("/static/1"))
      .andExpect(status().isOk());
    mockMvc.perform(get("/static/2"))
      .andExpect(status().isOk());

    mockMvc.perform(get("/app/1"))
      .andExpect(status().isOk());
    mockMvc.perform(get("/app/2"))
      .andExpect(status().isOk());

    mockMvc.perform(get("/favicon.ico"))
      .andExpect(status().isOk());
  }

  @Test
  void testApiUnauthorized() throws Exception {
    mockMvc.perform(get(API_2 + "/sub"))
      .andExpect(status().isUnauthorized());
  }

  @Test
  void testViewsUnauthorized() throws Exception {
    mockMvc.perform(get(VIEWS + "/sub"))
      .andExpect(status().isUnauthorized());
  }

  @Test
  void testApiAuthorized() throws Exception {
    mockMvc.perform(get(API_2 + "/sub")
        .with(authorization()))
      .andExpect(status().isOk());
  }

  @Test
  void testViewsAuthorized() throws Exception {
    mockMvc.perform(get(VIEWS + "/sub")
        .with(authorization()))
      .andExpect(status().isOk());
  }

  @Configuration
  static class TestConfiguration {

    @RestController
    static class TestController {
      @RequestMapping("/**")
      public void catchAll() {
        //returns 200
      }
    }
  }
}
