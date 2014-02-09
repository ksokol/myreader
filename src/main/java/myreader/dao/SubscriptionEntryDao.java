package myreader.dao;

import java.util.List;

import myreader.entity.SubscriptionEntry;
import myreader.entity.SubscriptionEntryQuery;

import myreader.solr.IndexService;
import myreader.solr.SubscriptionEntrySearchService;
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

    @Autowired
    private SubscriptionEntrySearchService searchService;

    public void saveOrUpdate(SubscriptionEntry subscriptionEntry) {
        sessionFactory.getCurrentSession().saveOrUpdate(subscriptionEntry);
        indexService.save(subscriptionEntry);
    }

    public List<SubscriptionEntry> query(SubscriptionEntryQuery myQuery, String username) {
        if (myQuery.getLastId() != null) {
            SubscriptionEntry findById = this.findById(myQuery.getLastId());
            myQuery.setOffset(findById.getCreatedAt());
        }

        return searchService.findByQueryAndUser(myQuery, username);
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
}
