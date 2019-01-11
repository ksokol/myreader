package myreader.controller;

import org.springframework.boot.autoconfigure.web.servlet.error.BasicErrorController;
import org.springframework.boot.autoconfigure.web.servlet.error.ErrorViewResolver;
import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

import static org.springframework.http.MediaType.TEXT_HTML_VALUE;

@Controller
@RequestMapping("${server.error.path:${error.path:/error}}")
public class CustomErrorController extends BasicErrorController {

    private static final String FORWARD_INDEX_HTML = "forward:/index.html";

    public CustomErrorController(ErrorAttributes errorAttributes, ServerProperties errorProperties, List<ErrorViewResolver> errorViewResolvers) {
        super(errorAttributes, errorProperties.getError(), errorViewResolvers);
    }

    @Override
    @RequestMapping(produces = TEXT_HTML_VALUE)
    public ModelAndView errorHtml(HttpServletRequest request, HttpServletResponse response) {
        if(getStatus(request) == HttpStatus.NOT_FOUND) {
            response.setStatus(200);
            return new ModelAndView(FORWARD_INDEX_HTML);
        }
        return super.errorHtml(request, response);
    }
}
