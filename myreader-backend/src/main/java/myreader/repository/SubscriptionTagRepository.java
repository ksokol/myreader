package myreader.repository;

import myreader.entity.SubscriptionTag;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

/**
 *
 * @author Kamill Sokol
 */
public interface SubscriptionTagRepository extends CrudRepository<SubscriptionTag, Long> {

    @Query("select st from SubscriptionTag st where st.name = ?1 and st.user.email = ?#{principal.username}")
    Optional<SubscriptionTag> findByCurrentUserAndTag(String tag);

    @Query("select st from SubscriptionTag st where st.id = ?1 and st.user.email = ?#{principal.username}")
    Optional<SubscriptionTag> findByCurrentUserAndId(Long id);

    @Query("select st from SubscriptionTag st where st.user.email = ?1 order by st.name")
    List<SubscriptionTag> findAllByUserId(long userId);
}
