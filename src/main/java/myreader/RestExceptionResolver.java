package myreader;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import myreader.subscription.web.ValidationException;

import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.orm.hibernate4.HibernateObjectRetrievalFailureException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

@Component("handlerExceptionResolver")
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
//        else if (exception instanceof ObjectNotFoundException) {
//            status = 404;
//        } else if (exception instanceof HibernateObjectRetrievalFailureException && exception.getCause() instanceof ObjectNotFoundException) {
//            status = 404;
//        }
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