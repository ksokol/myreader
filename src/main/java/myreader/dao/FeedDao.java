package myreader.dao;

import java.util.List;

import myreader.entity.Feed;

import org.hibernate.ObjectNotFoundException;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class FeedDao {

    @Autowired
    private SessionFactory sessionFactory;

    @SuppressWarnings("unchecked")
    public List<Feed> findAll() {
        return this.sessionFactory.getCurrentSession().createQuery("from Feed").list();
    }

    public Feed findByUrl(String url) {
        Feed feed = (Feed) this.sessionFactory.getCurrentSession().createQuery("from Feed where url = ?").setString(0, url).uniqueResult();

        if (feed == null) {
            throw new ObjectNotFoundException(url, Feed.class.getName());
        } else {
            return feed;
        }
    }

    public void saveOrUpdate(Feed feed) {
        this.sessionFactory.getCurrentSession().persist(feed);
    }

    public void delete(Long id) {
        Feed f = (Feed) this.sessionFactory.getCurrentSession().get(Feed.class, id);

        if (f != null) {
            this.sessionFactory.getCurrentSession().delete(f);
        }
    }

    public Long countByFeedEntry(Long id) {
        Long count = (Long) this.sessionFactory.getCurrentSession().createQuery("select count(f) from Feed f join f.entries fe where f.id = :id").setParameter("id", id).uniqueResult();
        return count;
    }
}
