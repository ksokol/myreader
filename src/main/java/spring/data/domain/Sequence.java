package spring.data.domain;

import java.util.List;

/**
 * @author Kamill Sokol
 */
public interface Sequence<T> extends Iterable<T> {

    int getSize();

    Long getNext();

    List<T> getContent();

    boolean hasContent();

    boolean hasNext();

    int getPageSize();

}
