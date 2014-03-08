package spring.security;

import myreader.repository.UserRepository;
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

    private UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        myreader.entity.User user = userRepository.findByEmail(username);

        if (user == null) {
            logger.info(String.format("Query returned no results for user '%s'", username));
            throw new UsernameNotFoundException(String.format("Username %s not found", username));
        }

        return new User(user.getEmail(), user.getPassword(), true /* enabled */,
                true, true, true, Arrays.asList(new SimpleGrantedAuthority(user.getRole())));
    }
}
