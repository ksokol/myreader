package myreader.service.user;

import myreader.entity.User;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
public interface UserService {

    User findOne(Long id);

    User getCurrentUser();

    void setPassword(User user, String newPassword);
}
