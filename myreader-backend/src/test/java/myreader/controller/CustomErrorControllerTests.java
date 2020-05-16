package myreader.controller;

import myreader.test.WithTestProperties;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.web.servlet.error.BasicErrorController;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.servlet.ModelAndView;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.OK;

@RunWith(SpringRunner.class)
@SpringBootTest
@WithTestProperties
public class CustomErrorControllerTests {

    @Autowired
    private BasicErrorController errorController;

    private MockHttpServletRequest request = new MockHttpServletRequest();
    private MockHttpServletResponse response = new MockHttpServletResponse();

    @Before
    public void setUp() {
        response.setStatus(0);
    }

    @Test
    public void shouldReturnDefaultErrorPageOn500() {
        ModelAndView modelAndView = errorController.errorHtml(request, response);

        assertThat(response.getStatus(), is(INTERNAL_SERVER_ERROR.value()));
        assertThat(modelAndView.getViewName(), is("error"));
    }

    @Test
    public void shouldForwardToIndexPageOn404() {
        request.setAttribute("javax.servlet.error.status_code", NOT_FOUND.value());

        ModelAndView modelAndView = errorController.errorHtml(request, response);

        assertThat(response.getStatus(), is(OK.value()));
        assertThat(modelAndView.getViewName(), is("forward:/index.html"));
    }
}
