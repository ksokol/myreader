package myreader.repository;

import myreader.entity.SubscriptionEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
public interface SubscriptionEntryRepository extends JpaRepository<SubscriptionEntry, Long> {

    @Query("from SubscriptionEntry where id = ?0 and subscription.user.email = ?1")
    SubscriptionEntry findByIdAndUsername(Long id, String username);

    @Query("select distinct tag from SubscriptionEntry where tag is not null and subscription.user.email = ?0 order by tag asc")
    List<String> findDistinctTagsByUsername(String username);
}
