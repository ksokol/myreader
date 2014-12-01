package myreader.resource.exception.handler;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

/**
 * @author Kamill Sokol
 */
@Order(Ordered.HIGHEST_PRECEDENCE)
@ControllerAdvice
public class HttpMessageNotReadableExceptionHandler {

    @ResponseStatus(BAD_REQUEST)
    @ResponseBody
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public Error exception(Exception e) throws Exception {
        return new Error(BAD_REQUEST.value(), e.getMessage());
    }
}
