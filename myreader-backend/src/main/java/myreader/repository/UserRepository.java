package myreader.repository;

import myreader.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

    Page<User> findByEmail(String email, Pageable pageable);
}
