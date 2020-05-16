package myreader.test;

import myreader.entity.User;
import myreader.security.AuthenticatedUser;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithSecurityContextFactory;

/**
 * @author Kamill Sokol
 */
public class WithAuthenticatedUserSecurityContextFactory implements WithSecurityContextFactory<WithAuthenticatedUser> {

    @Override
    public SecurityContext createSecurityContext(WithAuthenticatedUser withAuthenticatedUser) {
        TestUser testUser = withAuthenticatedUser.value();
        User user = new User(testUser.email);
        user.setId(testUser.id);
        user.setPassword(testUser.password);
        user.setRole(testUser.role);
        AuthenticatedUser authenticatedUser = new AuthenticatedUser(user);

        Authentication authentication = new UsernamePasswordAuthenticationToken(authenticatedUser, authenticatedUser.getPassword(), authenticatedUser.getAuthorities());
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        return context;
    }
}
