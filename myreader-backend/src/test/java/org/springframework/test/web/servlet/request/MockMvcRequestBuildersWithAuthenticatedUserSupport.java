package org.springframework.test.web.servlet.request;

import myreader.test.KnownUser;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;

import java.util.Collections;
import java.util.Set;

import static myreader.test.KnownUser.ADMIN;
import static myreader.test.KnownUser.USER1;
import static myreader.test.KnownUser.USER100;
import static myreader.test.KnownUser.USER2;
import static myreader.test.KnownUser.USER3;
import static myreader.test.KnownUser.USER4;

/**
 * @author Kamill Sokol
 */
@Deprecated
public class MockMvcRequestBuildersWithAuthenticatedUserSupport extends MockMvcRequestBuilders {

    @Deprecated
    public static MockHttpServletRequestBuilderWithJsonSupport putAsAdmin(String urlTemplate, Object... urlVariables) {
        return actionAsUserX(HttpMethod.PUT, ADMIN, urlTemplate, urlVariables);
    }

    @Deprecated
    public static MockHttpServletRequestBuilder getAsUser1(String urlTemplate, Object... urlVariables) {
        return actionAsUserX(HttpMethod.GET, USER1, urlTemplate, urlVariables);
    }

    @Deprecated
    public static MockHttpServletRequestBuilder getAsUser2(String urlTemplate, Object... urlVariables) {
        return actionAsUserX(HttpMethod.GET, USER2, urlTemplate, urlVariables);
    }

    @Deprecated
    public static MockHttpServletRequestBuilder getAsUser3(String urlTemplate, Object... urlVariables) {
        return actionAsUserX(HttpMethod.GET, USER3, urlTemplate, urlVariables);
    }

    @Deprecated
    public static MockHttpServletRequestBuilder getAsUser4(String urlTemplate, Object... urlVariables) {
        return actionAsUserX(HttpMethod.GET, USER4, urlTemplate, urlVariables);
    }

    @Deprecated
    public static MockHttpServletRequestBuilderWithJsonSupport patchAsUser1(String urlTemplate, Object... urlVariables) {
        return actionAsUserX(HttpMethod.PATCH, USER1, urlTemplate, urlVariables);
    }

    @Deprecated
    public static MockHttpServletRequestBuilderWithJsonSupport postAsUser2(String urlTemplate, Object... urlVariables) {
        return actionAsUserX(HttpMethod.POST, USER2, urlTemplate, urlVariables);
    }

    @Deprecated
    public static MockHttpServletRequestBuilderWithJsonSupport postAsUser100(String urlTemplate, Object... urlVariables) {
        return actionAsUserX(HttpMethod.POST, USER100, urlTemplate, urlVariables);
    }

    @Deprecated
    public static MockHttpServletRequestBuilderWithJsonSupport actionAsUserX(HttpMethod method, KnownUser user, String urlTemplate, Object... urlVariables) {
        MockHttpServletRequestBuilderWithJsonSupport mockHttpServletRequestBuilder = new MockHttpServletRequestBuilderWithJsonSupport(method, urlTemplate, urlVariables);
        addAuthentication(user);
        return mockHttpServletRequestBuilder;
    }

    private static void addAuthentication(KnownUser user) {
        String role = user.admin ? "ROLE_ADMIN" : "ROLE_USER";
        SimpleGrantedAuthority simpleGrantedAuthority = new SimpleGrantedAuthority(role);
        Set<SimpleGrantedAuthority> singleton = Collections.singleton(simpleGrantedAuthority);
        User myReaderUser = new User(user.username, user.password, true, true, true, true, singleton);
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(myReaderUser,null, singleton);
        SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
    }

}
