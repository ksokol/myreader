package myreader.repository;

import myreader.entity.TagGroup;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

/**
 * @author Kamill Sokol
 */
@Repository
class SubscriptionRepositoryImpl implements SubscriptionRepositoryCustom {

    private static final String SQL = "SELECT user_feed_tag, SUM(user_feed_unseen) as unseen, null "+
                                "FROM user_feed WHERE user_feed_user_id = ?1 AND user_feed_tag IS NOT NULL GROUP BY user_feed_tag "+
                                "UNION SELECT user_feed_title, user_feed_unseen, user_feed_id "+
                                "FROM user_feed WHERE user_feed_user_id = ?1 AND user_feed_tag IS NULL ";

    private static final String NEW_SQL = "SELECT user_feed_tag, SUM(user_feed_unseen) as unseen, null "+
            "FROM user_feed WHERE user_feed_user_id = ?1 AND user_feed_tag IS NOT NULL and user_feed_unseen > 0 GROUP BY user_feed_tag "+
            "UNION SELECT user_feed_title, user_feed_unseen, user_feed_id "+
            "FROM user_feed WHERE user_feed_user_id = ?1 AND user_feed_tag IS NULL and user_feed_unseen > 0";

    private static final String COUNT_SQL = "select sum(t.c1) from ( " +
                                    "SELECT COUNT(distinct user_feed_tag) c1 " +
                                    "FROM user_feed WHERE user_feed_user_id = ?1 AND user_feed_tag IS NOT NULL " +
                                    "UNION SELECT count(*) c " +
                                    "FROM user_feed WHERE user_feed_user_id = ?1 AND user_feed_tag IS NULL) t";

    private static final String NEW_COUNT_SQL = "select sum(t.c1) from ( " +
            "SELECT COUNT(distinct user_feed_tag) c1 " +
            "FROM user_feed WHERE user_feed_user_id = ?1 AND user_feed_tag IS NOT NULL and user_feed_unseen > 0 " +
            "UNION SELECT count(*) c " +
            "FROM user_feed WHERE user_feed_user_id = ?1 AND user_feed_tag IS NULL and user_feed_unseen > 0) t";

    @PersistenceContext
    private EntityManager em;

    @Override
    public Page<TagGroup> findByUserGroupByTag(Long userId, Pageable pageable) {
        long total = getCount(COUNT_SQL, userId);
        List<Object[]> resultList = getResultList(SQL, pageable, userId);
        return toPage(resultList, total, pageable);
    }

    @Override
    public Page<TagGroup> findNewByUserGroupByTag(Long userId, Pageable pageable) {
        long total = getCount(NEW_COUNT_SQL, userId);
        List<Object[]> resultList = getResultList(NEW_SQL, pageable, userId);
        return toPage(resultList, total, pageable);
    }

    private long getCount(String sql, Long userId) {
        Query nativeQuery = em.createNativeQuery(sql);
        nativeQuery.setParameter(1, userId);
        Number count = (Number) nativeQuery.getSingleResult();
        return count.longValue();
    }

    private List<Object[]> getResultList(String sql, Pageable pageable, Long userId) {
        Query nativeQuery = em.createNativeQuery(sql);
        nativeQuery.setParameter(1, userId);
        nativeQuery.setFirstResult(pageable.getOffset());
        nativeQuery.setMaxResults(pageable.getPageSize());
        return nativeQuery.getResultList();
    }

    private Page<TagGroup> toPage(List<Object[]> resultList, long total, Pageable pageable) {
        return new PageImpl<>(toTagGroup(resultList), pageable, total);
    }

    private List<TagGroup> toTagGroup(List<Object[]> resultList) {
        ArrayList<TagGroup> tagGroups = new ArrayList<>();
        for (Object[] objects : resultList) {
            String name = (String) objects[0];
            Number id = BigInteger.ZERO;
            Number sum = (Number) objects[1];
            TagGroup.Type type = TagGroup.Type.AGGREGATE;

            if(objects[2] != null) {
                id = (Number) objects[2];
                type = TagGroup.Type.SUBSCRIPTION;
            }
            tagGroups.add(new TagGroup(id.longValue(), name, sum.intValue(), type));
        }
        return tagGroups;
    }
}
