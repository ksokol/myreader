package myreader.test;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

import static org.springframework.security.core.authority.AuthorityUtils.createAuthorityList;

/**
 * @author Kamill Sokol
 */
public final class CustomRequestPostProcessors {

    private CustomRequestPostProcessors() {
        //disallow instantiation
    }

    public static RequestPostProcessor sessionUser(KnownUser user) {
        return request -> {
            SecurityContextImpl securityContext = new SecurityContextImpl();
            securityContext.setAuthentication(new UsernamePasswordAuthenticationToken(user.username, user.password, createAuthorityList(user.role)));
            request.getSession(true).setAttribute("SPRING_SECURITY_CONTEXT", securityContext);
            return request;
        };
    }

    public static RequestPostProcessor xmlHttpRequest() {
        return request -> {
            request.addHeader("X-Requested-With", "XMLHttpRequest");
            return request;
        };
    }
}
