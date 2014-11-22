package spring.security.web.headers.writers;

import org.springframework.security.web.header.HeaderWriter;
import org.springframework.util.StringUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @author Kamill Sokol
 */
public class CorsHeaderWriter implements HeaderWriter {
    @Override
    public void writeHeaders(HttpServletRequest request, HttpServletResponse response) {
        response.addHeader("Access-Control-Allow-Origin", "*");

        if (!"OPTIONS".equals(request.getMethod())) {
            return;
        }

        String allowMethods = request.getHeader("Access-Control-Request-Method");
        if (StringUtils.hasText(allowMethods)) {
            response.setHeader("Access-Control-Allow-Methods", allowMethods);
        }
        String allowHeaders = request.getHeader("Access-Control-Request-Headers");
        if (StringUtils.hasText(allowHeaders)) {
            response.setHeader("Access-Control-Allow-Headers", allowHeaders);
        }
    }
}
