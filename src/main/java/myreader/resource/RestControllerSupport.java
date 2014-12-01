package myreader.resource;

import myreader.entity.Identifiable;
import org.springframework.util.Assert;
import spring.data.domain.Sequence;
import spring.data.domain.SequenceImpl;
import spring.data.domain.SequenceRequest;
import spring.data.domain.Sequenceable;
import spring.hateoas.ResourceAssemblers;

import java.util.List;

/**
 * @author Kamill Sokol
 */
public class RestControllerSupport {

    protected final ResourceAssemblers resourceAssemblers;

    public RestControllerSupport(final ResourceAssemblers resourceAssemblers) {
        this.resourceAssemblers = resourceAssemblers;
    }

    public static <T extends Identifiable> Sequence<T> toSequence(final Sequenceable sequenceable, final List<T> content) {
        Assert.notNull(content, "Content must not be null!");
        Assert.notNull(sequenceable, "Sliceable must not be null!");
        boolean hasNext = content.size() == (sequenceable.getPageSize() + 1);

        if(!hasNext) {
            return new SequenceImpl<>(content);
        }

        Identifiable last = content.get(content.size() - 1);
        List<T> withoutLast = content.subList(0, content.size() - 1);

        Sequenceable request = new SequenceRequest(sequenceable.getPageSize(), last.getId());
        return new SequenceImpl<>(withoutLast, request);
    }
}
