package myreader.repository;

import static org.apache.commons.lang.StringUtils.isNotEmpty;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.EntityManager;

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
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.transaction.annotation.Transactional;

import myreader.entity.SubscriptionEntry;

/**
* @author Kamill Sokol
*/
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

    private final EntityManager em;

    public SubscriptionEntryRepositoryImpl(final EntityManager em) {
        this.em = em;
    }

    @SuppressWarnings("unchecked")
    @Override
    public Slice<SubscriptionEntry> findBy(String q, Long ownerId, String feedId, String feedTagEqual, String seen, Long nextId, Pageable pageable) {
        final FullTextEntityManager fullTextEntityManager = Search.getFullTextEntityManager(em);
        final QueryBuilder queryBuilder = fullTextEntityManager.getSearchFactory().buildQueryBuilder().forEntity(SubscriptionEntry.class).get();

        Query query;

        if(isNotEmpty(q)) {
            query =  queryBuilder.bool()
                        .should(queryBuilder.keyword().wildcard().onField(CONTENT).matching(q).createQuery())
                        .should(queryBuilder.keyword().wildcard().onField(TITLE).matching(q).createQuery())
                        .should(queryBuilder.keyword().wildcard().onField(TAG).matching(q).createQuery())
                     .createQuery();
        } else {
            query = queryBuilder.bool().must(queryBuilder.all().createQuery()).createQuery();
        }

        final FullTextQuery fullTextQuery = fullTextEntityManager.createFullTextQuery(query, SubscriptionEntry.class);
        final ArrayList<Filter> termFilters = new ArrayList<>(5);

        addFilter(USER_ID, ownerId.toString(), termFilters);

        if(isNotEmpty(feedId)) {
            addFilter(SUBSCRIPTION_ID, feedId, termFilters);
        }

        if(isNotEmpty(seen)) {
            addFilter(SEEN, seen, termFilters);
        }

        if(isNotEmpty(feedTagEqual)) {
            addFilter(SUBSCRIPTION_TAG, feedTagEqual, termFilters);
        }

        if(nextId != null) {
            final NumericRangeFilter<Long> id = NumericRangeFilter.newLongRange(ID, 0L, nextId, true, true);
            termFilters.add(id);
        }

        fullTextQuery.setFilter(new ChainedFilter(termFilters.toArray(new Filter[termFilters.size()]), ChainedFilter.AND));
        fullTextQuery.setMaxResults(pageable.getPageSize());
        fullTextQuery.setSort(new Sort(new SortField(ID, SortField.Type.LONG, true)));

        return new SliceImpl<>(fullTextQuery.getResultList());
    }

    private void addFilter(final String fieldName, final String fieldValue, final List<Filter> filters) {
        final TermFilter filter = new TermFilter(new Term(fieldName, fieldValue));
        filters.add(filter);
    }
}
