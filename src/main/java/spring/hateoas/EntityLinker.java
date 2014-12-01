package spring.hateoas;

import org.springframework.hateoas.Link;
import org.springframework.hateoas.LinkBuilder;
import org.springframework.util.Assert;
import org.springframework.util.ClassUtils;
import spring.hateoas.annotation.Rel;

import static myreader.utils.UrlUtils.encodeAsUTF8;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

/**
 * @author Kamill Sokol
 */
public class EntityLinker implements EntityLinks {

    private final Class<?> entityClass;
    private final Class<?> resourceClass;
    private final String rel;

    public EntityLinker(Class<?> entityClass, Class<?> resourceClass) {
        Assert.notNull(entityClass, "entity class is null");
        Assert.notNull(resourceClass, "resource class is null");

        this.entityClass = entityClass;
        this.resourceClass = resourceClass;
        Rel relAnnotation = entityClass.getAnnotation(Rel.class);

        if(relAnnotation != null) {
            this.rel = relAnnotation.value();
        } else {
            this.rel = entityClass.getSimpleName().toLowerCase();
        }
    }

    @Override
    public LinkBuilder linkFor(Class<?> type) {
        return linkTo(resourceClass);
    }

    @Override
    public LinkBuilder linkFor(Class<?> type, Object... parameters) {
        return linkFor(type).slash(encodeAsUTF8(parameters[0]));
    }

    @Override
    public Link linkToCollectionResource(Class<?> type) {
        return linkFor(type).withRel(rel);
    }

    @Override
    public Link linkToSingleResource(Class<?> type, Object id) {
        return linkFor(type, id).withSelfRel();
    }

    @Override
    public Link linkForSingleResource(Class<?> type, Object id) {
        Assert.notNull(type, "type is null");
        return linkToSingleResource(type.getClass(), id);
    }

    protected boolean supports(Class<?> delimiter) {
        return ClassUtils.isAssignable(entityClass, delimiter);
    }

    protected Class<?> getResourceClass() {
        return resourceClass;
    }

    protected String getRel() {
        return rel;
    }

}
