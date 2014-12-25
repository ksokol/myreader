package myreader.user;

import myreader.API;
import myreader.dto.UserDto;
import myreader.entity.User;
import myreader.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Deprecated
@Controller
@RequestMapping({ "user", API.V1 + "user" })
public class UserApi {

    @Autowired
    private UserRepository userRepository;

    @RequestMapping(value = "{email:.+}", method = RequestMethod.GET)
    @ResponseBody
    public UserDto user(@PathVariable String email, Authentication auth) {
        User user = userRepository.findByEmail(email);

        if (!user.getEmail().equals(auth.getName())) {
            throw new AccessDeniedException(null);
        }

        UserDto dto = new UserDto();
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());

        return dto;
    }
}
