package myreader.controller;

import jakarta.servlet.RequestDispatcher;
import myreader.test.WithTestProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.web.servlet.error.BasicErrorController;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.OK;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@WithTestProperties
class CustomErrorControllerTests {

  @Autowired
  private BasicErrorController errorController;

  private final MockHttpServletRequest request = new MockHttpServletRequest();
  private final MockHttpServletResponse response = new MockHttpServletResponse();

  @BeforeEach
  void setUp() {
    response.setStatus(0);
  }

  @Test
  void shouldReturnDefaultErrorPageOn500() {
    var modelAndView = errorController.errorHtml(request, response);

    assertThat(response.getStatus())
      .isEqualTo(INTERNAL_SERVER_ERROR.value());
    assertThat(modelAndView.getViewName())
      .isEqualTo("error");
  }

  @Test
  void shouldForwardToIndexPageOn404() {
    request.setAttribute(RequestDispatcher.ERROR_STATUS_CODE, NOT_FOUND.value());

    var modelAndView = errorController.errorHtml(request, response);

    assertThat(response.getStatus())
      .isEqualTo(OK.value());
    assertThat(modelAndView.getViewName())
      .isEqualTo("forward:/index.html");
  }
}
