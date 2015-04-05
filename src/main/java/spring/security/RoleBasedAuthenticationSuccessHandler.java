package spring.security;

import java.io.IOException;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

@Deprecated
public class RoleBasedAuthenticationSuccessHandler implements AuthenticationSuccessHandler {
    private Map<String, String> roleUrlMap;

    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException,
            ServletException {

        String role = authentication.getAuthorities().isEmpty() ? null : authentication.getAuthorities().toArray()[0].toString();
        response.sendRedirect(request.getContextPath() + roleUrlMap.get(role));
    }

    public Map<String, String> getRoleUrlMap() {
        return roleUrlMap;
    }

    public void setRoleUrlMap(Map<String, String> roleUrlMap) {
        this.roleUrlMap = roleUrlMap;
    }

}
