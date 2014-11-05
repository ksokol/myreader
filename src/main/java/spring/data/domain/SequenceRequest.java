package spring.data.domain;

import java.io.Serializable;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

/**
 * @author Kamill Sokol
 */
public class SequenceRequest implements Sequenceable, Serializable {

    private static final long serialVersionUID = -3961412475337650197L;

    private final int size;
    private final Long next;

    public SequenceRequest(final int size, final Long next) {
        this.size = size;
        this.next = next;
    }

    @Override
    public int getPageSize() {
        return this.size;
    }

    @Override
    public Long getNext() {
        return next;
    }

    @Override
    public Sequenceable next() {
        return new SequenceRequest(this.size, this.next);
    }

    @Override
    public Pageable toPageable() {
        return new PageRequest(0, getPageSize() + 1);
    }
}
