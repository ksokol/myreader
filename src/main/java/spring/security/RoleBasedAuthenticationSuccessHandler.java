package spring.security;

import java.io.IOException;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.util.Assert;

/**
 * @author Kamill Sokol
 */
@Deprecated
public class RoleBasedAuthenticationSuccessHandler implements RedirectStrategy {

    private final Map<String, String> roleUrlMap;

    public RoleBasedAuthenticationSuccessHandler(final Map<String, String> roleUrlMap) {
        Assert.notNull(roleUrlMap, "roleUrlMap is null");
        this.roleUrlMap = roleUrlMap;
    }

    @Override
    public void sendRedirect(final HttpServletRequest request, final HttpServletResponse response, final String url) throws IOException {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        final String role = authentication.getAuthorities().isEmpty() ? null : authentication.getAuthorities().toArray()[0].toString();
        response.sendRedirect(request.getContextPath() + roleUrlMap.get(role));
    }
}
