package spring.security;

import myreader.dao.UserDao;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Arrays;
import java.util.logging.Logger;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
public class CustomUserDetailsService implements UserDetailsService {

    private static final Logger logger = Logger.getLogger(CustomUserDetailsService.class.getName());

    private UserDao userDao;

    public CustomUserDetailsService(UserDao userDao) {
        this.userDao = userDao;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        myreader.entity.User user = userDao.findByEmail(username);

        if (user == null) {
            logger.info(String.format("Query returned no results for user '%s'", username));
            throw new UsernameNotFoundException(String.format("Username %s not found", username));
        }

        return new User(user.getEmail(), user.getPassword(), true /* enabled */,
                true, true, true, Arrays.asList(new SimpleGrantedAuthority(user.getRole())));
    }
}
