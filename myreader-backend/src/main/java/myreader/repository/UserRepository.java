package myreader.repository;

import myreader.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author Kamill Sokol
 */
public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);
}
