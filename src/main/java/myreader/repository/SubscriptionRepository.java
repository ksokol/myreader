package myreader.repository;

import myreader.entity.Subscription;
import myreader.entity.TagGroup;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.persistence.LockModeType;
import java.util.List;

/**
 * @author Kamill Sokol
 */
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    @Override
    Subscription findOne(Long id);

    @Query("from Subscription where feed.url = ?1")
    List<Subscription> findByUrl(String url);

    @Deprecated
    @Query("from Subscription s join fetch s.feed where s.tag = ?1 and s.user.email = ?2")
    List<Subscription> findByTagAndUsername(String tag, String username);

    @Query(value = "from Subscription s join fetch s.feed where s.tag = ?1 and s.user.id = ?2", countQuery = "select count(*) from Subscription where tag = ?1 and user.id = ?2")
    Page<Subscription> findByTagAndUser(String tag, Long userId, Pageable pageable);

    @Query("from Subscription s join fetch s.feed where s.user.id = ?1")
    List<Subscription> findByUser(Long id);

    @Query(value="from Subscription s join fetch s.feed where s.user.id = ?1", countQuery = "select count(*) from Subscription s where s.user.id = ?1")
    Page<Subscription> findAllByUser(Long id, Pageable pageable);

    @Query("from Subscription where id = ?1 and user.email = ?2")
    Subscription findByIdAndUsername(Long id, String username);

    @Query("from Subscription where user.email = ?1 and feed.url = ?2")
    Subscription findByUsernameAndFeedUrl(String username, String url);

    @Query("from Subscription where user.id = ?1 and feed.url = ?2")
    Subscription findByUserIdAndFeedUrl(Long id, String url);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Modifying
    @Query("update Subscription set unseen = ?1 where id = ?2")
    void updateUnseen(int count, Long id);

    @Query(value = "select new myreader.entity.TagGroup(tag, sum(unseen)) from Subscription where user.id = ?1 and tag is not null group by tag", countQuery = "select count(*) from Subscription where user.id = ?1 and tag is not null group by tag")
    Page<TagGroup> findByUserGroupByTag(Long userId, Pageable pageable);

    @Query(value = "select new myreader.entity.TagGroup(tag, sum(unseen)) from Subscription where user.id = ?2 and tag = ?1 group by tag")
    TagGroup findTagGroupByTagAndUser(String tag, Long userId);
}
