package myreader.repository;

import myreader.entity.TagGroup;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * @author Kamill Sokol
 */
interface SubscriptionRepositoryCustom {

    Page<TagGroup> findByUserGroupByTag(Long userId, Pageable pageable);

    Page<TagGroup> findNewByUserGroupByTag(Long userId, Pageable pageable);
}
