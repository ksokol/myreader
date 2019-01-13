package myreader.test.request;

import org.springframework.test.web.servlet.request.RequestPostProcessor;

/**
 * @author Kamill Sokol
 */
public final class RequestedWithHeaderPostProcessors {

    private RequestedWithHeaderPostProcessors() {
        //disallow instantiation
    }

    public static RequestPostProcessor xmlHttpRequest() {
        return request -> {
            request.addHeader("X-Requested-With", "XMLHttpRequest");
            return request;
        };
    }
}
