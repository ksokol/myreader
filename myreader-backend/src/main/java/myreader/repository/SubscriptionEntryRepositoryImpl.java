package myreader.repository;

import com.google.common.base.Splitter;
import com.google.common.collect.Iterables;
import myreader.entity.SubscriptionEntry;
import org.apache.lucene.index.Term;
import org.apache.lucene.queries.ChainedFilter;
import org.apache.lucene.queries.TermFilter;
import org.apache.lucene.search.Filter;
import org.apache.lucene.search.NumericRangeFilter;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.Sort;
import org.apache.lucene.search.SortField;
import org.hibernate.search.jpa.FullTextEntityManager;
import org.hibernate.search.jpa.FullTextQuery;
import org.hibernate.search.jpa.Search;
import org.hibernate.search.query.dsl.QueryBuilder;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;
import java.util.regex.Pattern;

import static org.apache.commons.lang3.StringUtils.isNotEmpty;

/**
* @author Kamill Sokol
*/
@Component
@Transactional
public class SubscriptionEntryRepositoryImpl implements SubscriptionEntryRepositoryCustom {

    private static final String USER_ID = "subscription.user.userId";
    private static final String CONTENT = "feedEntry.content";
    private static final String TITLE = "feedEntry.title";
    private static final String TAG = "tag";
    private static final String SUBSCRIPTION_ID = "subscription.subscriptionId";
    private static final String SEEN = "seen";
    private static final String SUBSCRIPTION_TAG = "subscription.tag";
    private static final String ID = "id";
    private static final Pattern TAG_SPLIT_PATTERN = Pattern.compile("( |,)");

    private final EntityManager em;
    private final UserRepository userRepository;

    public SubscriptionEntryRepositoryImpl(final EntityManager em, UserRepository userRepository) {
        this.em = em;
        this.userRepository = userRepository;
    }

    @SuppressWarnings("unchecked")
    @Override
    public Slice<SubscriptionEntry> findByForCurrentUser(String q, String feedId, String feedTagEqual, String entryTagEqual, String seen, Long nextId, int pageSize) {
        final FullTextEntityManager fullTextEntityManager = Search.getFullTextEntityManager(em);
        final QueryBuilder queryBuilder = fullTextEntityManager.getSearchFactory().buildQueryBuilder().forEntity(SubscriptionEntry.class).get();
        final Query query = createQuery(q, queryBuilder);
        final FullTextQuery fullTextQuery = fullTextEntityManager.createFullTextQuery(query, SubscriptionEntry.class);
        final List<Filter> termFilters = new ArrayList<>(5);

        addFilter(USER_ID, userRepository.findByCurrentUser().getId(), termFilters);
        addFilter(SUBSCRIPTION_ID, feedId, termFilters);
        addFilter(SUBSCRIPTION_TAG, feedTagEqual, termFilters);
        addFilter(TAG, entryTagEqual, termFilters);
        addSeenFilter(seen, termFilters);
        addPagination(nextId, termFilters);

        fullTextQuery.setFilter(new ChainedFilter(termFilters.toArray(new Filter[termFilters.size()]), ChainedFilter.AND));
        fullTextQuery.setMaxResults(pageSize);
        fullTextQuery.setSort(new Sort(new SortField(ID, SortField.Type.LONG, true)));

        return new SliceImpl<>(fullTextQuery.getResultList());
    }

    @Override
    public Set<String> findDistinctTagsForCurrentUser() {
        final TypedQuery<String> query = em.createQuery("select distinct(se.tag) from SubscriptionEntry as se where se.subscription.user.id = :id and se.tag is not null", String.class);

        query.setParameter("id", userRepository.findByCurrentUser().getId());

        final List<String> resultList = query.getResultList();
        final Set<String> distinctTags = new TreeSet<>();

        for (final String distinctTag : resultList) {
            final Iterable<String> splitted = Splitter.on(TAG_SPLIT_PATTERN).trimResults().omitEmptyStrings().split(distinctTag);
            Iterables.addAll(distinctTags, splitted);
        }

        return distinctTags;
    }

    private Query createQuery(final String q, final QueryBuilder queryBuilder) {
        Query query;

        if(isNotEmpty(q)) {
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

    private void addSeenFilter(final String seenValue, final List<Filter> filters) {
        if(!"*".equals(seenValue)) {
            addFilter(SEEN, seenValue, filters);
        }
    }

    private void addFilter(final String fieldName, final Object fieldValue, final List<Filter> filters) {
        if(fieldValue != null) {
            final TermFilter filter = new TermFilter(new Term(fieldName, fieldValue.toString()));
            filters.add(filter);
        }
    }

    private void addPagination(final Long nextId, final List<Filter> termFilters) {
        if(nextId != null) {
            final NumericRangeFilter<Long> id = NumericRangeFilter.newLongRange(ID, 0L, nextId, true, true);
            termFilters.add(id);
        }
    }
}
