package myreader.dao;

import myreader.entity.User;

import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Repository
public class UserDao {

    @PersistenceContext
    private EntityManager em;

    public User findByEmail(String email) {
        return em.createQuery("from User where email = :email", User.class).setParameter("email", email).getSingleResult();
    }
}
