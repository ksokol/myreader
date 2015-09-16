package spring.data.domain;

import org.springframework.data.domain.Pageable;

/**
 * @author Kamill Sokol
 */
public interface Sequenceable {

    int getPageSize();

    Long getNext();

    Pageable toPageable();

}
