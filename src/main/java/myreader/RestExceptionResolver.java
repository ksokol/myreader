package myreader;

import com.fasterxml.jackson.databind.ObjectMapper;
import myreader.service.EntityNotFoundException;
import myreader.subscription.web.ValidationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

public class RestExceptionResolver implements HandlerExceptionResolver {

    Logger logger = LoggerFactory.getLogger(getClass());

    @Override
    public ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response, Object object, Exception exception) {
        int status = 405;

        Map<String, Object> data = new HashMap<String, Object>();
        Object msg = null;

        if (exception instanceof ValidationException) {
            status = 400;
            msg = ((ValidationException) exception).getMessages();
        }
        else if (exception instanceof EntityNotFoundException) {
            status = 404;
        }
        else if (exception instanceof AccessDeniedException) {
            status = 403;
        } else if (exception instanceof myreader.service.AccessDeniedException) {
            status = 403;
        } else if (exception != null) {
            msg = exception.getMessage();
            logger.error("", exception);
        }

        try {
            ObjectMapper objectMapper = new ObjectMapper();

            data.put("status", status);
            if (msg != null) data.put("message", msg);

            response.setStatus(status);
            response.setContentType("application/json");

            objectMapper.writeValue(response.getOutputStream(), data);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        }

        return new ModelAndView();
    }
}