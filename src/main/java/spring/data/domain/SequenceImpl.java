package spring.data.domain;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

import org.springframework.util.Assert;

/**
 * @author Kamill Sokol
 */
public class SequenceImpl<T> implements Sequence<T >, Serializable {

    private static final long serialVersionUID = 867755909294344406L;

    private final List<T> content = new ArrayList<>();
    private final Sequenceable next;

    public SequenceImpl(List<T> content, Sequenceable sequenceable) {
        Assert.notNull(content, "Content must not be null!");
        Assert.notNull(sequenceable, "Sliceable must not be null!");
        this.content.addAll(content);
        this.next = sequenceable;
    }

    public SequenceImpl(List<T> content) {
        Assert.notNull(content, "Content must not be null!");
        this.content.addAll(content);
        this.next = null;
    }

    public SequenceImpl() {
        Assert.notNull(content, "Content must not be null!");
        this.next = null;
    }

    public Long getNext() {
        if(hasNext()) {
            return next.getNext();
        }
        return null;
    }

    public int getSize() {
        return next == null ? 0 : next.getPageSize();
    }

    public boolean hasContent() {
        return !content.isEmpty();
    }

    public List<T> getContent() {
        return Collections.unmodifiableList(content);
    }

    public Iterator<T> iterator() {
        return content.iterator();
    }

    public boolean hasNext() {
        return next != null && next.getNext() != null;
    }

    @Override
    public int getPageSize() {
        return next == null ? 0 : next.getPageSize();
    }

}
