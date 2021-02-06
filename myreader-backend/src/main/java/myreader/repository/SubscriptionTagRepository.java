package myreader.repository;

import myreader.entity.SubscriptionTag;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface SubscriptionTagRepository extends CrudRepository<SubscriptionTag, Long> {

  @Query("select st from SubscriptionTag st where st.name = ?1 and st.id = any (select s.subscriptionTag.id from Subscription s)")
  Optional<SubscriptionTag> findByTag(String tag);

  @Override
  @Query("select st from SubscriptionTag st where st.id = ?1 and st.id = any (select s.subscriptionTag.id from Subscription s)")
  Optional<SubscriptionTag> findById(Long id);

  @Override
  @Query("select st from SubscriptionTag st where st.id = any (select s.subscriptionTag.id from Subscription s) order by st.name")
  List<SubscriptionTag> findAll();

  @Query("select count(s) from Subscription s where s.subscriptionTag.id = ?1")
  long countBySubscriptions(long id);
}
