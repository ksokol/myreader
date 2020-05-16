package myreader.security;

import myreader.entity.User;
import myreader.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.Objects;

/**
 * @author Kamill Sokol
 */
@Component
public class UserRepositoryUserDetailsService implements UserDetailsService {

    private static final Logger LOG = LoggerFactory.getLogger(UserRepositoryUserDetailsService.class);

    private final UserRepository userRepository;

    public UserRepositoryUserDetailsService(UserRepository userRepository) {
        this.userRepository = Objects.requireNonNull(userRepository, "userRepository is null");
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        User user = userRepository.findByEmail(username);

        if (user == null) {
            if (LOG.isWarnEnabled()) {
                LOG.warn(String.format("Query returned no results for user '%s'", username));
            }
            throw new UsernameNotFoundException(String.format("Username %s not found", username));
        }

        return new AuthenticatedUser(user);
    }
}
