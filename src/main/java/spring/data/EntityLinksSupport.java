package spring.data;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.LinkBuilder;
import org.springframework.hateoas.TemplateVariable;
import org.springframework.hateoas.TemplateVariables;
import org.springframework.hateoas.UriTemplate;
import org.springframework.hateoas.core.AbstractEntityLinks;
import org.springframework.util.Assert;
import org.springframework.util.ClassUtils;

import spring.data.annotation.Rel;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

/**
 * @author Kamill Sokol
 */
public abstract class EntityLinksSupport extends AbstractEntityLinks {

    private final Class<?> entityClass;
    private final Class<?> resourceClass;
    private final String rel;

    private final PagedResourcesAssembler pagedResourcesAssembler;

    public EntityLinksSupport(Class<?> entityClass, Class<?> resourceClass, PagedResourcesAssembler pagedResourcesAssembler) {
        this.pagedResourcesAssembler = pagedResourcesAssembler;
        Assert.notNull(entityClass, "entity class is null");
        Assert.notNull(resourceClass, "resource class is null");

        this.entityClass = entityClass;
        this.resourceClass = resourceClass;
        Rel relAnnotation = entityClass.getAnnotation(Rel.class);

        Assert.notNull(relAnnotation);
        this.rel = relAnnotation.value();
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
        Link link = linkFor(type).withRel(rel);
        return pagedResourcesAssembler.appendPaginationParameterTemplates(link);
    }

    @Override
    public Link linkToSingleResource(Class<?> type, Object id) {
        return linkFor(type, id).withSelfRel();
    }

    @Override
    public boolean supports(Class<?> delimiter) {
        return ClassUtils.isAssignable(entityClass, delimiter);
    }

    protected WithLinkBuilder with(Class<?> type) {
        return new WithLinkBuilder(linkFor(type).withRel(getRel()));
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

    protected class WithLinkBuilder {

        private Link link;

        public WithLinkBuilder(Link link) {
            this.link = link;
        }

        public WithLinkBuilder pagination() {
            link = pagedResourcesAssembler.appendPaginationParameterTemplates(link);
            return this;
        }

        public WithLinkBuilder requestParam(String key) {
            return template(key, TemplateVariable.VariableType.REQUEST_PARAM);
        }

        public Link link() {
            return link;
        }

        private WithLinkBuilder template(String key, TemplateVariable.VariableType type) {
            String uri = link.getHref();
            UriTemplate uriTemplate = new UriTemplate(uri);

            TemplateVariable templateVariable = new TemplateVariable(key, type);
            TemplateVariables variables = new TemplateVariables(templateVariable);

            link = new Link(uriTemplate.with(variables), link.getRel());

            return this;
        }
    }
}
