package spring.hateoas;

import java.util.List;

import org.springframework.hateoas.Link;
import org.springframework.hateoas.LinkBuilder;
import org.springframework.util.Assert;

/**
 * @author Kamill Sokol
 */
public class DelegatingEntityLinks implements EntityLinks {

    private final List<EntityLinker> delegates;

    public DelegatingEntityLinks(List<EntityLinker> delegates) {
        Assert.notNull(delegates, "delegates must not be null!");
        this.delegates = delegates;
    }

    @Override
    public LinkBuilder linkFor(Class<?> type) {
        return getDelegateFor(type).linkFor(type);
    }

    @Override
    public LinkBuilder linkFor(Class<?> type, Object... parameters) {
        return getDelegateFor(type).linkFor(type, parameters);
    }

    @Override
    public Link linkToCollectionResource(Class<?> type) {
        return getDelegateFor(type).linkToCollectionResource(type);
    }

    @Override
    public Link linkToSingleResource(Class<?> type, Object id) {
        return getDelegateFor(type).linkToSingleResource(type, id);
    }

    @Override
    public Link linkForSingleResource(Class<?> type, Object id) {
        return getDelegateFor(type).linkToSingleResource(type, id);
    }

    protected boolean supports(Class<?> delimiter) {
        return getDelegateForInternal(delimiter) != null;
    }


    protected EntityLinker getDelegateFor(Class<?> type) {
        EntityLinker delegate = getDelegateForInternal(type);
        if(delegate != null) {
            return delegate;
        }
        throw new IllegalArgumentException("Cannot determine link for "+type.getName()+". No entityLinks instance found supporting the domain type!");
    }

    protected EntityLinker getDelegateForInternal(Class<?> type) {
        for (EntityLinker delegate : delegates) {
            if(delegate.supports(type)) {
                return delegate;
            }
        }
        return null;
    }
}
