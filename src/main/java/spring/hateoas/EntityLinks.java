package spring.hateoas;

import org.springframework.hateoas.Link;
import org.springframework.hateoas.LinkBuilder;

/**
 * @author Kamill Sokol
 */
public interface EntityLinks {

    LinkBuilder linkFor(Class<?> type);

    LinkBuilder linkFor(Class<?> type, Object... parameters);

    Link linkToCollectionResource(Class<?> type);

    Link linkToSingleResource(Class<?> type, Object id);

    Link linkForSingleResource(Class<?> type, Object id);
}
