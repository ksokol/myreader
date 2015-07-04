package spring.security;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @author Kamill Sokol
 */
public class XAuthoritiesFilter extends GenericFilterBean {

    @Override
    public void doFilter(final ServletRequest req, final ServletResponse res, final FilterChain chain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;
        UsernamePasswordAuthenticationToken token = (UsernamePasswordAuthenticationToken) request.getUserPrincipal();

        if(token != null && CollectionUtils.isNotEmpty(token.getAuthorities())) {
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
