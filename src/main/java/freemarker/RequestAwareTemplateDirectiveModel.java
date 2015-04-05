package freemarker;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import freemarker.template.TemplateDirectiveModel;

/**
 * @author Kamill Sokol
 */
abstract class RequestAwareTemplateDirectiveModel implements TemplateDirectiveModel {
    
    protected HttpServletRequest getRequest() {
        final ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        return requestAttributes.getRequest();
    }
    protected ServletContext getServletContext() {
        return getRequest().getServletContext();
    }
}
