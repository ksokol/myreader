package myreader.repository;

import com.google.common.base.Splitter;
import com.google.common.collect.Iterables;
import myreader.entity.SubscriptionEntry;
import org.apache.lucene.index.Term;
import org.apache.lucene.search.BooleanClause.Occur;
import org.apache.lucene.search.BooleanQuery;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.Sort;
import org.apache.lucene.search.SortField;
import org.apache.lucene.search.TermQuery;
import org.hibernate.search.jpa.FullTextEntityManager;
import org.hibernate.search.jpa.FullTextQuery;
import org.hibernate.search.jpa.Search;
import org.hibernate.search.query.dsl.QueryBuilder;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.TreeSet;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static org.apache.commons.lang3.StringUtils.isNotEmpty;
import static org.apache.lucene.search.NumericRangeQuery.newLongRange;

/**
* @author Kamill Sokol
*/
@Component
public class SubscriptionEntryRepositoryImpl implements SubscriptionEntryRepositoryCustom {

    private static final String USER_ID = "subscription.user.userId";
    private static final String CONTENT = "feedEntry.content";
    private static final String TITLE = "feedEntry.title";
    private static final String TAG = "tag";
    private static final String SUBSCRIPTION_ID = "subscription.subscriptionId";
    private static final String SEEN = "seen";
    private static final String SUBSCRIPTION_TAG = "subscription.subscriptionTag.tag";
    private static final String ID = "id";
    private static final Pattern TAG_SPLIT_PATTERN = Pattern.compile("[ |,]");

    private final EntityManager em;
    private final UserRepository userRepository;

    public SubscriptionEntryRepositoryImpl(EntityManager em, UserRepository userRepository) {
        this.em = Objects.requireNonNull(em, "em is null");
        this.userRepository = Objects.requireNonNull(userRepository, "userRepository is null");
    }

    @Override
    public Slice<SubscriptionEntry> findByForCurrentUser(
            int size,
            String q,
            String feedId,
            String feedTagEqual,
            String entryTagEqual,
            String seen,
            Long next
    ) {
        int sizePlusOne = size + 1;
        FullTextEntityManager fullTextEntityManager = Search.getFullTextEntityManager(em);
        QueryBuilder queryBuilder = fullTextEntityManager.getSearchFactory().buildQueryBuilder().forEntity(SubscriptionEntry.class).get();
        Query query = createQuery(q, queryBuilder);
        BooleanQuery.Builder builder = new BooleanQuery.Builder();

        builder.add(query, Occur.MUST);
        addFilter(USER_ID, userRepository.findByCurrentUser().getId(), builder);
        addFilter(SUBSCRIPTION_ID, feedId, builder);
        addFilter(SUBSCRIPTION_TAG, feedTagEqual, builder);
        addFilter(TAG, entryTagEqual, builder);
        addSeenFilter(seen, builder);
        addPagination(next, builder);

        FullTextQuery fullTextQuery = fullTextEntityManager.createFullTextQuery(builder.build(), SubscriptionEntry.class);
        fullTextQuery.setSort(new Sort(new SortField(ID, SortField.Type.LONG, true)));
        fullTextQuery.setMaxResults(sizePlusOne);

        @SuppressWarnings("unchecked")
        List<SubscriptionEntry> resultList = fullTextQuery.getResultList();

        List<SubscriptionEntry> limit = resultList.stream()
                .limit(size)
                .collect(Collectors.toList());

        return new SliceImpl<>(limit, Pageable.unpaged(), resultList.size() == sizePlusOne);
    }

    @Override
    public Set<String> findDistinctTagsForCurrentUser() {
        TypedQuery<String> query = em.createQuery("select distinct(se.tag) from SubscriptionEntry as se where se.subscription.user.id = :id and se.tag is not null", String.class);

        query.setParameter("id", userRepository.findByCurrentUser().getId());

        List<String> resultList = query.getResultList();
        Set<String> distinctTags = new TreeSet<>();

        for (String distinctTag : resultList) {
            Iterable<String> splitted = Splitter.on(TAG_SPLIT_PATTERN).trimResults().omitEmptyStrings().split(distinctTag);
            Iterables.addAll(distinctTags, splitted);
        }

        return distinctTags;
    }

    private Query createQuery(String q, QueryBuilder queryBuilder) {
        Query query;

        if (isNotEmpty(q)) {
            String searchToken = q.endsWith("*") ? q : q + "*";
            query =  queryBuilder.bool()
                    .should(queryBuilder.keyword().wildcard().onField(CONTENT).matching(searchToken).createQuery())
                    .should(queryBuilder.keyword().wildcard().onField(TITLE).matching(searchToken).createQuery())
                    .should(queryBuilder.keyword().wildcard().onField(TAG).matching(searchToken).createQuery())
                    .createQuery();
        } else {
            query = queryBuilder.bool().must(queryBuilder.all().createQuery()).createQuery();
        }
        return query;
    }

    private void addSeenFilter(String seenValue, BooleanQuery.Builder builder) {
        if (seenValue != null && !"*".equals(seenValue)) {
            builder.add(new TermQuery(new Term(SEEN, seenValue)), Occur.FILTER);
        }
    }

    private void addFilter(String fieldName, Object fieldValue, BooleanQuery.Builder builder) {
        if (fieldValue != null) {
            builder.add(new TermQuery(new Term(fieldName, fieldValue.toString())), Occur.FILTER);
        }
    }

    private void addPagination(Long next, BooleanQuery.Builder builder) {
        if (next != null) {
            builder.add(newLongRange(ID, 0L, next, true, false), Occur.FILTER);
        }
    }
}
