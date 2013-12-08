package myreader.dao;

import java.util.List;

import myreader.entity.FeedEntry;
import myreader.entity.FeedEntryQuery;

import org.hibernate.Criteria;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class FeedEntryRepository {

    @Autowired
    private SessionFactory sessionFactory;

    public void saveOrUpdate(FeedEntry feedEntry) {
        this.sessionFactory.getCurrentSession().saveOrUpdate(feedEntry);
    }

    public int countByTitleOrGuidOrUrl(String title, String guid, String url) {
        Number count = (Number) sessionFactory.getCurrentSession().createQuery("select count(*) from FeedEntry where title = :title or guid = :guid or url = :url").setString("title", title).setString("guid", guid).setString("url", url).uniqueResult();
        return count.intValue();
    }

    public void delete(Long id) {
        FeedEntry fe = (FeedEntry) this.sessionFactory.getCurrentSession().get(FeedEntry.class, id);

        if (fe != null) {
            this.sessionFactory.getCurrentSession().delete(fe);
        }
    }

    public List<FeedEntry> query(FeedEntryQuery query) {
        Criteria createCriteria = this.sessionFactory.getCurrentSession().createCriteria(FeedEntry.class);

        if (query.getCreatedAtFilter() != null) {
            createCriteria.add(Restrictions.le("createdAt", query.getCreatedAtFilter()));
        }

        if (query.getFeedIdFilter() != null) {
            createCriteria.createCriteria("feed").add(Restrictions.eq("id", query.getFeedIdFilter()));
        }

        return createCriteria.list();
    }
}
