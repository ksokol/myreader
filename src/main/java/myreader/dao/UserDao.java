package myreader.dao;

import myreader.entity.User;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class UserDao {

    @Autowired
    private SessionFactory sessionFactory;

    public User findByEmail(String email) {
        return (User) this.sessionFactory.getCurrentSession().createQuery("from User where email = ?").setString(0, email).uniqueResult();
    }
}
