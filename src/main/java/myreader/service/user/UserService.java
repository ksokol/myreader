package myreader.service.user;

import myreader.entity.User;

/**
 * @author Kamill Sokol
 */
public interface UserService {

    User getCurrentUser();

    void setPassword(User user, String newPassword);
}
