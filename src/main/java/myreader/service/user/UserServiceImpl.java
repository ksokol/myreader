package myreader.service.user;

import myreader.entity.User;
import myreader.repository.UserRepository;
import myreader.service.session.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.encoding.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

/**
 * @author Kamill Sokol
 */
@Service
public class UserServiceImpl implements UserService {

    private final SessionService sessionService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(SessionService sessionService, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.sessionService = sessionService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User getCurrentUser() {
        String currentUsername = sessionService.getCurrentUsername();
        return userRepository.findByEmail(currentUsername);
    }

    @Override
    public void setPassword(User user, String newPassword) {
        Assert.notNull(user);

        //TODO salt me, hash me
        String hashed = passwordEncoder.encodePassword(newPassword, null);
        user.setPassword(hashed);
        userRepository.save(user);
    }
}
