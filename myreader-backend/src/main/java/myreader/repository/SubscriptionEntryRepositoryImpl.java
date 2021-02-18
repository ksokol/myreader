package myreader.repository;

import myreader.entity.SubscriptionEntry;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Collectors;

@Component
public class SubscriptionEntryRepositoryImpl implements SubscriptionEntryRepositoryCustom {

  private static final int DEFAULT_SIZE = 10;

  private final EntityManager em;

  public SubscriptionEntryRepositoryImpl(EntityManager em) {
    this.em = Objects.requireNonNull(em, "em is null");
  }

  @Override
  public Slice<SubscriptionEntry> findBy(
    String feedId,
    String feedTagEqual,
    String entryTagEqual,
    Boolean seen,
    Long next
  ) {
    var sizePlusOne = DEFAULT_SIZE + 1;
    var predicates = new ArrayList<String>();
    var params = new HashMap<String, Object>();

    var sql = new StringBuilder(300);
    sql.append("select se.* from subscription_entry se join subscription s on s.id = se.subscription_id");

    if (entryTagEqual != null) {
      predicates.add("position_array(:entryTagEqual in se.tags) > 0");
      params.put("entryTagEqual", entryTagEqual);
    }

    if (feedId != null) {
      predicates.add("se.subscription_id = :feedId");
      params.put("feedId", feedId);
    }

    if (feedTagEqual != null) {
      predicates.add("s.tag = :feedTagEqual");
      params.put("feedTagEqual", feedTagEqual);
    }

    if (seen != null) {
      predicates.add("se.seen = :seen");
      params.put("seen", seen);
    }

    if (next != null) {
      predicates.add("se.id < :next");
      params.put("next", next);
    }

    predicates.add("se.excluded = false");

    for (int i = 0; i < predicates.size(); i++) {
      sql.append(i > 0 ? " and " : " where ").append(predicates.get(i));
    }

    sql.append(" order by se.id desc");

    Query query = em.createNativeQuery(sql.toString(), SubscriptionEntry.class);
    for (Map.Entry<String, Object> entry : params.entrySet()) {
      query.setParameter(entry.getKey(), entry.getValue());
    }

    query.setMaxResults(sizePlusOne);

    @SuppressWarnings("unchecked")
    List<SubscriptionEntry> resultList = query.getResultList();
    var limit = resultList.stream()
      .limit(DEFAULT_SIZE)
      .collect(Collectors.toList());

    return new SliceImpl<>(limit, Pageable.unpaged(), resultList.size() == sizePlusOne);
  }

  @Override
  public Set<String> findDistinctTags() {
    var query = em.createQuery("select se from SubscriptionEntry se where se.tags is not null", SubscriptionEntry.class);
    var resultList = query.getResultList();
    Set<String> tags = new TreeSet<>();

    for (var entry : resultList) {
      tags.addAll(entry.getTags());
    }

    return tags;
  }
}
