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
public interface SubscriptionRepository extends JpaRepository<Subscription, Long>, SubscriptionRepositoryCustom {

    @Override
    Subscription findOne(Long id);

    @Query("select s from Subscription s where s.feed.url = ?1")
    List<Subscription> findByUrl(String url);

    @Deprecated
    @Query("select s from Subscription s join fetch s.feed where s.tag = ?1 and s.user.email = ?2")
    List<Subscription> findByTagAndUsername(String tag, String username);

    @Query(value = "select s from Subscription s join fetch s.feed where s.tag = ?1 and s.user.id = ?2", countQuery = "select count(s) from Subscription s where s.tag = ?1 and s.user.id = ?2")
    Page<Subscription> findByTagAndUser(String tag, Long userId, Pageable pageable);

    @Query("select s from Subscription s join fetch s.feed where s.user.id = ?1")
    List<Subscription> findByUser(Long id);

    @Query(value="select s from Subscription s join fetch s.feed where s.user.id = ?1", countQuery = "select count(s) from Subscription s where s.user.id = ?1")
    Page<Subscription> findAllByUser(Long id, Pageable pageable);

    @Query("select s from Subscription s where s.id = ?1 and s.user.email = ?2")
    Subscription findByIdAndUsername(Long id, String username);

    @Query("select s from Subscription s where s.user.email = ?1 and s.feed.url = ?2")
    Subscription findByUsernameAndFeedUrl(String username, String url);

    @Query("select s from Subscription s where s.user.id = ?1 and s.feed.url = ?2")
    Subscription findByUserIdAndFeedUrl(Long id, String url);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Modifying
    @Query("update Subscription set unseen = ?1 where id = ?2")
    void updateUnseen(int count, Long id);

    @Query(value = "select new myreader.entity.TagGroup(s.tag, sum(s.unseen)) from Subscription s where s.user.id = ?2 and s.tag = ?1 group by s.tag")
    TagGroup findTagGroupByTagAndUser(String tag, Long userId);
}
