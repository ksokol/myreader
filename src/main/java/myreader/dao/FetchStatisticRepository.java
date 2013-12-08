package myreader.dao;

import myreader.entity.FetchStatistics;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Transactional(propagation = Propagation.REQUIRES_NEW)
@Repository
public class FetchStatisticRepository {

    @Autowired
    private SessionFactory sessionFactory;

    public void saveOrUpdate(FetchStatistics fetchStatistics) {
        this.sessionFactory.getCurrentSession().saveOrUpdate(fetchStatistics);
    }
}
