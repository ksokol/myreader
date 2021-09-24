package myreader.repository;

import myreader.entity.SubscriptionEntry;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.data.jdbc.core.JdbcAggregateOperations;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcOperations;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Collectors;

@Component
public class SubscriptionEntryRepositoryImpl implements SubscriptionEntryRepositoryCustom {

  private static final int DEFAULT_SIZE = 10;

  private final NamedParameterJdbcOperations jdbcTemplate;
  private final JdbcAggregateOperations template;

  public SubscriptionEntryRepositoryImpl(NamedParameterJdbcOperations jdbcTemplate, JdbcAggregateOperations template) {
    this.jdbcTemplate = Objects.requireNonNull(jdbcTemplate, "jdbcTemplate is null");
    this.template = Objects.requireNonNull(template, "template is null");
  }

  @Override
  public Slice<SubscriptionEntry> findBy(String feedId, String feedTagEqual, String entryTagEqual, Boolean seen, Long next) {
    var sizePlusOne = DEFAULT_SIZE + 1;
    var predicates = new ArrayList<String>();
    var params = new HashMap<String, Object>();

    var sql = new StringBuilder(300);
    sql.append("select se.id from subscription_entry se join subscription s on s.id = se.subscription_id");

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

    sql.append(" order by se.id desc limit ").append(sizePlusOne);

    var ids = jdbcTemplate.queryForList(sql.toString(), params, Long.class);
    List<SubscriptionEntry> resultList = new ArrayList<>();
    template.findAllById(ids, SubscriptionEntry.class).iterator()
      .forEachRemaining(resultList::add);

    var limit = resultList.stream()
      .sorted(Comparator.comparingLong(SubscriptionEntry::getId).reversed())
      .limit(DEFAULT_SIZE)
      .collect(Collectors.toList());

    return new SliceImpl<>(limit, Pageable.unpaged(), resultList.size() == sizePlusOne);
  }

  @Override
  public Set<String> findDistinctTags() {
    Set<String> distinctTags = new TreeSet<>();

    jdbcTemplate.query("select distinct tags from subscription_entry where tags is not null", (ResultSet rs) ->
      Arrays.stream((Object[]) rs.getArray(1).getArray())
        .map(Object::toString)
        .forEach(distinctTags::add)
    );

    return distinctTags;
  }
}
