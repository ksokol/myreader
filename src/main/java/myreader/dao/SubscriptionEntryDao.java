package myreader.dao;

import java.util.Collections;
import java.util.List;

import myreader.entity.SubscriptionEntry;
import myreader.entity.SubscriptionEntryQuery;

import myreader.solr.IndexService;
import org.apache.lucene.search.BooleanClause;
import org.apache.lucene.search.BooleanQuery;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.QueryWrapperFilter;
import org.apache.lucene.search.Sort;
import org.apache.lucene.search.SortField;
import org.apache.solr.client.solrj.SolrServer;
import org.hibernate.ObjectNotFoundException;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class SubscriptionEntryDao {

    @Autowired
    private SessionFactory sessionFactory;

    @Autowired
    private IndexService indexService;

    public void saveOrUpdate(SubscriptionEntry subscriptionEntry) {
        sessionFactory.getCurrentSession().saveOrUpdate(subscriptionEntry);
        indexService.save(subscriptionEntry);
    }

    public List<SubscriptionEntry> query(SubscriptionEntryQuery myQuery) {
        return query(myQuery, null);
    }

    public List<SubscriptionEntry> query(SubscriptionEntryQuery myQuery, Long userId) {
//        Query luceneQuery = null;
//        BooleanQuery filterPredicates = new BooleanQuery();
//        FullTextSession fullTextSession = Search.getFullTextSession(this.sessionFactory.getCurrentSession());
//        QueryBuilder qb = fullTextSession.getSearchFactory().buildQueryBuilder().forEntity(SubscriptionEntry.class).get();
//        WildcardContext wildcard = qb.keyword().wildcard();
//        FullTextQuery fullTextQuery = null;
//
//        BooleanQuery tmp = new BooleanQuery();
//        for (String k : myQuery.getFilter().keySet()) {
//            PhraseTermination sentence = qb.phrase().onField(k).sentence(myQuery.getFilter().get(k));
//            tmp.add(sentence.createQuery(), BooleanClause.Occur.SHOULD);
//
//        }
//        if (tmp.clauses().size() > 0) {
//            MustJunction must = qb.bool().must(tmp);
//            filterPredicates.add(must.createQuery(), BooleanClause.Occur.MUST);
//        }
//
//        if (!myQuery.isShowAll()) {
//            Query filterQuery = qb.keyword().onField("seen").matching(false).createQuery();
//            filterPredicates.add(filterQuery, BooleanClause.Occur.MUST);
//        }
//
//        if (userId != null) {
//            Query filterQuery = qb.keyword().onField("subscription.user.id").matching(userId).createQuery();
//            filterPredicates.add(filterQuery, BooleanClause.Occur.MUST);
//        }
//
//        if (myQuery.getLastId() != null) {
//            //TODO
//            SubscriptionEntry findById = this.findById(myQuery.getLastId());
//            Query filterQuery = null;
//
//            if ("createdAt".equals(myQuery.getOrderBy())) {
//                if ("asc".equals(myQuery.getSortMode())) {
//                    filterQuery = qb.range().onField("createdAt").above(findById.getCreatedAt()).excludeLimit().createQuery();
//                } else {
//                    filterQuery = qb.range().onField("createdAt").below(findById.getCreatedAt()).excludeLimit().createQuery();
//                }
//            } else {
//                filterQuery = qb.range().onField("createdAt").above(findById.getCreatedAt()).excludeLimit().createQuery();
//            }
//
//            filterPredicates.add(filterQuery, BooleanClause.Occur.MUST);
//        }
//
//        wildcard.filteredBy(new QueryWrapperFilter(filterPredicates));
//
//        if (myQuery.getQ() != null) {
//            luceneQuery = wildcard.onField("feedEntry.title").andField("feedEntry.content").matching(myQuery.getQ()).createQuery();
//        } else {
//            luceneQuery = wildcard.onField("feedEntry.title").andField("feedEntry.content").matching("*").createQuery();
//        }
//
//        fullTextQuery = fullTextSession.createFullTextQuery(luceneQuery, SubscriptionEntry.class);
//
//        if (myQuery.getOrderBy() != null) {
//            SortField sortField = null;
//
//            if ("asc".equals(myQuery.getSortMode())) {
//                sortField = new SortField(myQuery.getOrderBy(), SortField.Type.STRING);
//            } else {
//                sortField = new SortField(myQuery.getOrderBy(), SortField.Type.STRING, true);
//            }
//
//            fullTextQuery.setSort(new Sort(sortField));
//        }
//
//        fullTextQuery.setMaxResults(myQuery.getRows());
        return Collections.EMPTY_LIST; //fullTextQuery.list();
    }

    //TODO
    private SubscriptionEntry findById(Long id) {
        SubscriptionEntry s = (SubscriptionEntry) sessionFactory.getCurrentSession().createQuery("from SubscriptionEntry where id = :id").setParameter("id", id).uniqueResult();

        if (s == null) {
            ObjectNotFoundException e = new ObjectNotFoundException(id, SubscriptionEntry.class.getName());
            throw e;
        } else {
            return s;
        }
    }

    public SubscriptionEntry findById(Long id, String username) {
        SubscriptionEntry s = (SubscriptionEntry) this.sessionFactory.getCurrentSession().createQuery("from SubscriptionEntry where id = :id and subscription.user.email = :username").setParameter("id", id).setParameter("username", username).uniqueResult();

        if (s == null) {
            ObjectNotFoundException e = new ObjectNotFoundException(id, SubscriptionEntry.class.getName());
            throw e;
        } else {
            return s;
        }
    }

    public List<String> findByDistinctTag(String username) {
        return this.sessionFactory.getCurrentSession().createQuery("select distinct tag from SubscriptionEntry where tag is not null and subscription.user.email = :username order by tag asc").setParameter("username", username).list();
    }

    public long count() {
        Number count = (Number) this.sessionFactory.getCurrentSession().createQuery("select count(id) from SubscriptionEntry").uniqueResult();
        return count.longValue();
    }
}
