package myreader.repository;

import myreader.entity.TagGroup;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * @author Kamill Sokol
 */
@Repository
class SubscriptionRepositoryImpl implements SubscriptionRepositoryCustom {

    private static String SQL = "SELECT user_feed_tag, cast(SUM(user_feed_unseen) as INT), null "+
                                "FROM user_feed WHERE user_feed_user_id = ?1 AND user_feed_tag IS NOT NULL GROUP BY user_feed_tag "+
                                "UNION SELECT user_feed_title, user_feed_unseen, CAST(user_feed_id as INT) "+
                                "FROM user_feed WHERE user_feed_user_id = ?1 AND user_feed_tag IS NULL";

    private static String COUNT_SQL = "select sum(t.c1) from ( " +
                                    "SELECT COUNT(distinct user_feed_tag) c1 " +
                                    "FROM user_feed WHERE user_feed_user_id = ?1 AND user_feed_tag IS NOT NULL " +
                                    "UNION SELECT count(*) c " +
                                    "FROM user_feed WHERE user_feed_user_id = ?1 AND user_feed_tag IS NULL) t";

    @PersistenceContext
    private EntityManager em;

    @Override
    public Page<TagGroup> findByUserGroupByTag(Long userId, Pageable pageable) {
        long total = getCount(userId);
        List<Object[]> resultList = getResultList(pageable, userId);
        return toPage(resultList, total, pageable);
    }

    private long getCount(Long userId) {
        Query nativeQuery = em.createNativeQuery(COUNT_SQL);
        nativeQuery.setParameter(1, userId);
        List<Number> counts = (List<Number>) nativeQuery.getResultList();
        return counts.get(0).longValue();
    }

    private List<Object[]> getResultList(Pageable pageable, Long userId) {
        Query nativeQuery = em.createNativeQuery(SQL);
        nativeQuery.setParameter(1, userId);
        nativeQuery.setFirstResult(pageable.getOffset());
        nativeQuery.setMaxResults(pageable.getPageSize());
        return nativeQuery.getResultList();
    }

    private Page<TagGroup> toPage(List<Object[]> resultList, long total, Pageable pageable) {
        List<TagGroup> content = total > pageable.getOffset() ? toTagGroup(resultList) : Collections.<TagGroup>emptyList();
        return new PageImpl(content, pageable, total);
    }

    private List<TagGroup> toTagGroup(List<Object[]> resultList) {
        ArrayList<TagGroup> tagGroups = new ArrayList<>();
        for (Object[] objects : resultList) {
            String name = (String) objects[0];
            int id = 0;
            int sum = (int) objects[1];
            TagGroup.Type type = TagGroup.Type.AGGREGATE;

            if(objects[2] != null) {
                id = (int) objects[2];
                type = TagGroup.Type.SUBSCRIPTION;
            }
            tagGroups.add(new TagGroup(id, name, sum, type));
        }
        return tagGroups;
    }
}
