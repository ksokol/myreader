package myreader.test.request;

import myreader.test.WithTestProperties;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

public final class AuthorizationPostProcessors {

  private AuthorizationPostProcessors() {
    //disallow instantiation
  }

  public static RequestPostProcessor authorization() {
    return request -> {
      request.addHeader("Authorization", "Bearer " + WithTestProperties.PASSWORD);
      return request;
    };
  }
}
