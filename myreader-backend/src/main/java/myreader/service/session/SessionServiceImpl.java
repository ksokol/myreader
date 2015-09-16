package myreader.service.session;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
@Service
public class SessionServiceImpl implements SessionService {

    @Override
    public String getCurrentUsername() {
        //TODO NPE check
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
