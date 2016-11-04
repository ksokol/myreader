package myreader.controller;

import org.junit.Before;
import org.junit.Test;
import org.springframework.boot.autoconfigure.web.BasicErrorController;
import org.springframework.boot.autoconfigure.web.DefaultErrorAttributes;
import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.web.servlet.ModelAndView;

import java.util.Collections;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.OK;

public class CustomErrorControllerTest {

    private BasicErrorController errorController;
    private MockHttpServletRequest request = new MockHttpServletRequest();
    private MockHttpServletResponse response = new MockHttpServletResponse();

    @Before
    public void setUp() throws Exception {
        errorController = new CustomErrorController(new DefaultErrorAttributes(), new ServerProperties(), Collections.emptyList());
        response.setStatus(0);
    }

    @Test
    public void shouldReturnDefaultErrorPageOn500() throws Exception {
        ModelAndView modelAndView = errorController.errorHtml(request, response);

        assertThat(response.getStatus(), is(INTERNAL_SERVER_ERROR.value()));
        assertThat(modelAndView.getViewName(), is("error"));
    }

    @Test
    public void shouldForwardToIndexPageOn404() throws Exception {
        request.setAttribute("javax.servlet.error.status_code", NOT_FOUND.value());

        ModelAndView modelAndView = errorController.errorHtml(request, response);

        assertThat(response.getStatus(), is(OK.value()));
        assertThat(modelAndView.getViewName(), is("forward:/index.html"));
    }
}
