package myreader.resource.exception.handler;

import myreader.service.AccessDeniedException;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * @author Kamill Sokol
 */
@Order(Ordered.HIGHEST_PRECEDENCE)
@ControllerAdvice
class AccessDeniedExceptionHandler {

    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ResponseBody
    @ExceptionHandler(AccessDeniedException.class)
    public void exception(Exception e) {
        //empty
    }
}
