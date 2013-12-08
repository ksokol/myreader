package myreader.user;

import myreader.API;
import myreader.dao.UserDao;
import myreader.dto.UserDto;
import myreader.entity.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Transactional
@Controller
@RequestMapping({ "api/user", API.V1 + "user" })
//TODO
public class UserApi {

    @Autowired
    UserDao userDao;

    @RequestMapping(value = "{email:.+}", method = RequestMethod.GET)
    @ResponseBody
    public UserDto user(@PathVariable String email, Authentication auth) {
        User user = userDao.findByEmail(email);

        if (user == null || !auth.getName().equals(email)) {
            throw new AccessDeniedException(null);
        }

        UserDto dto = new UserDto();
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());

        return dto;
    }
}