package spring.security;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.SpringSecurityCoreVersion;
import org.springframework.security.core.userdetails.User;

/**
 * @author Kamill Sokol
 */
public class MyReaderUser extends User {

    private static final long serialVersionUID = SpringSecurityCoreVersion.SERIAL_VERSION_UID + 1L;

    private final Long id;
    private final boolean adminUser;

    public MyReaderUser(Long id, String username, String password, boolean enabled, boolean accountNonExpired, boolean credentialsNonExpired, boolean accountNonLocked, Collection<? extends GrantedAuthority> authorities, boolean adminUser) {
        super(username, password, enabled, accountNonExpired, credentialsNonExpired, accountNonLocked, authorities);
        this.id = id;
        this.adminUser = adminUser;
    }

    public Long getId() {
        return id;
    }

    public boolean isAdmin() {
        return adminUser;
    }
}
