package spring.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

/**
 * @author Kamill Sokol
 */
public final class XAuthoritiesFilterUtils {

    private XAuthoritiesFilterUtils() {
        // prevent instantiation
    }

    public static String buildAuthorities(Authentication token) {
        if(token == null || token.getAuthorities().isEmpty()) {
            return "";
        }

        final StringBuilder authorities = new StringBuilder(token.getAuthorities().size() * 10);
        for (final GrantedAuthority grantedAuthority : token.getAuthorities()) {
            authorities.append(grantedAuthority.getAuthority());
            authorities.append(',');
        }
        return authorities.subSequence(0, authorities.length() - 1).toString();
    }
}
