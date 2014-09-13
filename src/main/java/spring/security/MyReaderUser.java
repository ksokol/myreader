package spring.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

/**
 * @author Kamill Sokol
 */
public class MyReaderUser extends User {

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
