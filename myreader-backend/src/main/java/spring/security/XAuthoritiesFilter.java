package spring.security;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * @author Kamill Sokol
 */
public class XAuthoritiesFilter extends GenericFilterBean {

    @Override
    public void doFilter(final ServletRequest req, final ServletResponse res, final FilterChain chain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;
        AbstractAuthenticationToken token = (AbstractAuthenticationToken) request.getUserPrincipal();

        if(token != null && !token.getAuthorities().isEmpty()) {
            final StringBuilder authorities = new StringBuilder(token.getAuthorities().size() * 10);
            for (final GrantedAuthority grantedAuthority : token.getAuthorities()) {
                authorities.append(grantedAuthority.getAuthority());
                authorities.append(',');
            }

            response.addHeader("X-MY-AUTHORITIES", authorities.subSequence(0, authorities.length() - 1).toString());
        }

        chain.doFilter(request, response);
    }
}
