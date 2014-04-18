package myreader.service.user;

import myreader.entity.User;
import myreader.repository.UserRepository;
import myreader.service.EntityNotFoundException;
import myreader.service.session.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.encoding.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * @author Kamill Sokol dev@sokol-web.de
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
    public User findOne(Long id) {
        User user = userRepository.findOne(id);
        if(user == null) {
            throw new EntityNotFoundException();
        }
        return user;
    }

    @Override
    public User getCurrentUser() {
        String currentUsername = sessionService.getCurrentUsername();
        return userRepository.findByEmail(currentUsername);
    }

    @Override
    public void setPassword(Long id, String newPassword) {
        User user = findOne(id);

        //TODO salt me, hash me
        String hashed = passwordEncoder.encodePassword(newPassword, null);
        user.setPassword(hashed);
        userRepository.save(user);
    }
}
