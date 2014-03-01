package myreader.service.user.impl;

import myreader.dao.UserDao;
import myreader.entity.User;
import myreader.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
@Transactional
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDao userDao;

    @Override
    public User findByEmail(String email) {
        Assert.notNull(email);
        return userDao.findByEmail(email);
    }
}
