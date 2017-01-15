package spring.data.domain;

import org.springframework.util.Assert;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

/**
 * @author Kamill Sokol
 */
public class SequenceImpl<T> implements Sequence<T >, Serializable {

    private static final long serialVersionUID = 867755909294344406L;

    private final List<T> content = new ArrayList<>();
    private final long pageSize;
    private final Long nextId;

    public SequenceImpl(List<T> content, long pageSize, Long nextId) {
        Assert.notNull(content, "Content must not be null!");
        this.content.addAll(content);
        this.pageSize = pageSize;
        this.nextId = nextId;
    }

    public SequenceImpl(List<T> content) {
        Assert.notNull(content, "Content must not be null!");
        this.content.addAll(content);
        this.nextId = null;
        this.pageSize = content.size();
    }

    public SequenceImpl() {
        this.nextId = null;
        this.pageSize = 0;
    }

    public Long getNext() {
        if(hasNext()) {
            return nextId;
        }
        return null;
    }

    public int getSize() {
        return content.size();
    }

    public List<T> getContent() {
        return Collections.unmodifiableList(content);
    }

    public Iterator<T> iterator() {
        return content.iterator();
    }

    public boolean hasNext() {
        return nextId != null;
    }

    @Override
    public long getPageSize() {
        return pageSize;
    }

}
