package spring.data.mvc;

import javax.servlet.http.HttpServletRequest;

import org.springframework.core.MethodParameter;
import org.springframework.hateoas.Link;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;
import spring.data.TemplateLinkBuilder;

/**
 * @author Kamill Sokol
 */
public class TemplateLinkBuilderHandlerMethodArgumentResolver implements HandlerMethodArgumentResolver {
    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return TemplateLinkBuilder.class.equals(parameter.getParameterType());
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
        HttpServletRequest nativeRequest = webRequest.getNativeRequest(HttpServletRequest.class);
        String fullUrl = nativeRequest.getRequestURL().toString();
        if(nativeRequest.getQueryString() != null) {
            fullUrl += "?" + nativeRequest.getQueryString();
        }
        Link selfLink = new Link(fullUrl);
        return new TemplateLinkBuilder(selfLink);
    }
}
