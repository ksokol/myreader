package myreader.repository;

import myreader.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 * @author Kamill Sokol
 */
public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

    @Query(value="select u from User u where u.email = ?#{principal.username}")
    User findByCurrentUser();
}
