package spring;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

public class CacheControlInterceptor extends HandlerInterceptorAdapter {

    private Logger logger = LoggerFactory.getLogger(getClass());

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {

        if ("XMLHttpRequest".equals(request.getHeader("X-Requested-With"))) {
            logger.debug("XMLHttpRequest detected. Adding cache control header");

            response.addHeader("Cache-Control", "max-age=0,no-cache,no-store,post-check=0,pre-check=0");
            response.addHeader("Expires", "Mon, 26 Jul 1997 05:00:00 GMT");

        }

    }

}
