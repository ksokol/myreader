package spring.security;

import myreader.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
public class UserRepositoryUserDetailsService implements UserDetailsService {

    private static final Logger log = LoggerFactory.getLogger(UserRepositoryUserDetailsService.class);

    private final UserRepository userRepository;

    public UserRepositoryUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        myreader.entity.User user = userRepository.findByEmail(username);

        if (user == null) {
            log.info(String.format("Query returned no results for user '%s'", username));
            throw new UsernameNotFoundException(String.format("Username %s not found", username));
        }

        return new MyReaderUser(user.getId(), user.getEmail(), user.getPassword(), true /* enabled */,
                true, true, true, AuthorityUtils.createAuthorityList(user.getRole()));
    }
}
