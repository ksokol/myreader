package myreader.repository;

import myreader.entity.SubscriptionEntry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
public interface SubscriptionEntryRepository extends JpaRepository<SubscriptionEntry, Long> {

    @Query("from SubscriptionEntry se join fetch se.feedEntry where se.id = ?1 and se.subscription.user.email = ?2")
    SubscriptionEntry findByIdAndUsername(Long id, String username);

    @Query("select distinct tag from SubscriptionEntry where tag is not null and subscription.user.email = ?1 order by tag asc")
    List<String> findDistinctTagsByUsername(String username);

    @Query(value="from SubscriptionEntry se join fetch se.feedEntry join fetch se.subscription",countQuery = "select count(*) from SubscriptionEntry")
    @Override
    Page<SubscriptionEntry> findAll(Pageable pageable);

}
