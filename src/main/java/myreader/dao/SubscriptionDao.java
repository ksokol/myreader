package myreader.dao;

import java.util.List;
import java.util.Map;

import myreader.entity.Subscription;

import myreader.solr.IndexService;
import myreader.solr.SearchService;
import org.hibernate.ObjectNotFoundException;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class SubscriptionDao {

    @Autowired
    private SessionFactory sessionFactory;

    @Autowired
    private IndexService indexService;

    @Autowired
    private SearchService searchService;

    //@PostFilter("hasPermission(filterObject, 'read') or hasPermission(filterObject, 'admin')")

    public List<Subscription> findAll() {
        return this.sessionFactory.getCurrentSession().createQuery("from Subscription").list();
    }

    public List<Subscription> findByUrl(String url) {
        //Session session = this.sessionFactory.getCurrentSession();
        //session.enableFilter("user").setParameter("user", username);
        // return session.createQuery("from Subscription s join fetch s.feed").list();

        return this.sessionFactory.getCurrentSession().createQuery("from Subscription where feed.url = :url").setString("url", url).list();
    }

    public List<Subscription> findAll(String username) {
        //Session session = this.sessionFactory.getCurrentSession();
        //session.enableFilter("user").setParameter("user", username);
        // return session.createQuery("from Subscription s join fetch s.feed").list();

        List<Subscription> subscriptions = sessionFactory.getCurrentSession().createQuery("from Subscription where user.email = ?").setString(0, username).list();
        Map<Long,Long> counts = searchService.countUnseenSubscriptionEntries(username);

        for(Subscription s : subscriptions) {
            Long count = counts.get(s.getId());

            if(count != null) {
                s.setUnseen(count);
            }
        }

        return subscriptions;
    }

    //@PreAuthorize("")
    //@PostAuthorize("#returnObject.user.email == authentication.name")
    public Subscription findById(Long id, String username) {
        //  Subscription s = (Subscription) this.sessionFactory.getCurrentSession().load(Subscription.class, id);

        // return ss;

        Subscription s = (Subscription) this.sessionFactory.getCurrentSession().createQuery("from Subscription where id = ? and user.email = ?").setLong(0, id).setString(1, username).uniqueResult();

        if (s == null) {
            ObjectNotFoundException e = new ObjectNotFoundException(id, Subscription.class.getName());
            throw e;
        } else {
            long l = searchService.countUnseenSubscriptionEntries(s.getId());
            s.setUnseen(l);
            return s;
        }
    }

    public Subscription findByUrl(String url, String username) {
        //  Subscription s = (Subscription) this.sessionFactory.getCurrentSession().load(Subscription.class, id);

        // return ss;

        Subscription s = (Subscription) this.sessionFactory.getCurrentSession().createQuery("from Subscription where feed.url = ? and user.email = ?").setString(0, url).setString(1, username).uniqueResult();

        if (s == null) {
            ObjectNotFoundException e = new ObjectNotFoundException(url, Subscription.class.getName());
            throw e;
        } else {
            return s;
        }
    }

    public void deleteById(Long id, String username) {
        this.sessionFactory.getCurrentSession().delete(this.findById(id, username));
    }

    public void saveOrUpdate(Subscription subscription) {
        sessionFactory.getCurrentSession().persist(subscription);
        indexService.save(subscription);
    }

}
