package spring.hateoas;

import java.util.List;

import org.springframework.hateoas.EntityLinks;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.LinkBuilder;
import org.springframework.hateoas.core.AbstractEntityLinks;
import org.springframework.util.Assert;

/**
 * @author Kamill Sokol
 */
public class DelegatingEntityLinks extends AbstractEntityLinks {

    private final List<EntityLinks> delegates;

    public DelegatingEntityLinks(List<EntityLinks> delegates) {
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
    public boolean supports(Class<?> delimiter) {
        return getDelegateFor(delimiter) != null;
    }

    private EntityLinks getDelegateFor(Class<?> type) {
        for (EntityLinks delegate : delegates) {
            if(delegate.supports(type)) {
                return delegate;
            }
        }
        throw new IllegalArgumentException("Cannot determine link for "+type.getName()+". No EntityLinks instance found supporting the domain type!");
    }
}
