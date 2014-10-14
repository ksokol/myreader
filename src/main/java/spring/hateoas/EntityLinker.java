package spring.hateoas;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

import org.springframework.hateoas.Link;
import org.springframework.hateoas.LinkBuilder;
import org.springframework.hateoas.core.AbstractEntityLinks;
import org.springframework.util.Assert;
import org.springframework.util.ClassUtils;

import spring.data.annotation.Rel;

/**
 * @author Kamill Sokol
 */
public class EntityLinker extends AbstractEntityLinks {

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
    public boolean supports(Class<?> delimiter) {
        return ClassUtils.isAssignable(entityClass, delimiter);
    }

    protected Class<?> getResourceClass() {
        return resourceClass;
    }

    protected String getRel() {
        return rel;
    }

    private static String encodeAsUTF8(Object toEncode) {
        try {
            return URLEncoder.encode(String.valueOf(toEncode), "UTF-8");
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }
}
