package myreader.repository;

import myreader.entity.User;
import org.springframework.data.repository.CrudRepository;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
public interface UserRepository extends CrudRepository<User, Long> {

    User findByEmail(String email);
}
