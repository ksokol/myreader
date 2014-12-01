package myreader.service.user;

import myreader.entity.User;
import myreader.repository.UserRepository;
import myreader.service.session.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author Kamill Sokol
 */
@Service
public class UserServiceImpl implements UserService {

    private final SessionService sessionService;
    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(SessionService sessionService, UserRepository userRepository) {
        this.sessionService = sessionService;
        this.userRepository = userRepository;
    }

    @Override
    public User getCurrentUser() {
        String currentUsername = sessionService.getCurrentUsername();
        return userRepository.findByEmail(currentUsername);
    }

}
