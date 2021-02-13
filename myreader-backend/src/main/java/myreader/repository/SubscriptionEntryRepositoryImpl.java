package myreader.repository;

import myreader.entity.SubscriptionEntry;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.Objects;
import java.util.stream.Collectors;

@Component
public class SubscriptionEntryRepositoryImpl implements SubscriptionEntryRepositoryCustom {

  private final EntityManager em;

  public SubscriptionEntryRepositoryImpl(EntityManager em) {
    this.em = Objects.requireNonNull(em, "em is null");
  }

  @Override
  public Slice<SubscriptionEntry> findBy(
    int size,
    String feedId,
    String feedTagEqual,
    String entryTagEqual,
    Boolean seen,
    Long next
  ) {
    var sizePlusOne = size + 1;
    var cb = em.getCriteriaBuilder();
    var cq = cb.createQuery(SubscriptionEntry.class);
    var root = cq.from(SubscriptionEntry.class);
    var predicates = new ArrayList<Predicate>();

    cq.distinct(true);
    root.join("tags", JoinType.LEFT);

    if (entryTagEqual != null) {
      predicates.add(cb.equal(root.join("tags"), entryTagEqual));
    }

    if (feedId != null) {
      predicates.add(cb.equal(root.get("subscription").get("id"), feedId));
    }

    if (feedTagEqual != null) {
      predicates.add(cb.equal(root.get("subscription").get("subscriptionTag").get("name"), feedTagEqual));
    }

    if (seen != null) {
      predicates.add(cb.equal(root.get("seen"), seen));
    }

    if (next != null) {
      predicates.add(cb.lessThan(root.get("id"), next));
    }

    predicates.add(cb.equal(root.get("excluded"), false));

    cq.where(predicates.toArray(new Predicate[] {}));
    cq.orderBy(cb.desc(root.get("id")));

    var query = em.createQuery(cq);
    query.setMaxResults(sizePlusOne);

    var resultList = query.getResultList();
    var limit = resultList.stream()
      .limit(size)
      .collect(Collectors.toList());

    return new SliceImpl<>(limit, Pageable.unpaged(), resultList.size() == sizePlusOne);
  }
}
