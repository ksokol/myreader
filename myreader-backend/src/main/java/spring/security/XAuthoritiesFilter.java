package spring.security;

import org.springframework.security.core.Authentication;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static spring.security.SecurityConstants.MY_AUTHORITIES;

/**
 * @author Kamill Sokol
 */
public class XAuthoritiesFilter extends GenericFilterBean {

    @Override
    public void doFilter(final ServletRequest req, final ServletResponse res, final FilterChain chain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;
        Authentication token = (Authentication) request.getUserPrincipal();
        response.addHeader(MY_AUTHORITIES, XAuthoritiesFilterUtils.buildAuthorities(token));
        chain.doFilter(request, response);
    }
}
