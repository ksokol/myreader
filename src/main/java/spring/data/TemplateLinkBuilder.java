package spring.data;

import org.springframework.data.web.HateoasPageableHandlerMethodArgumentResolver;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.TemplateVariable;
import org.springframework.hateoas.TemplateVariables;
import org.springframework.hateoas.UriTemplate;
import org.springframework.util.Assert;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * @author Kamill Sokol
 */
public final class TemplateLinkBuilder {

    private static final HateoasPageableHandlerMethodArgumentResolver pageableResolver = new HateoasPageableHandlerMethodArgumentResolver();

    private Link link;
    private final UriComponents uriComponents;

    public TemplateLinkBuilder(Link link) {
        Assert.notNull(link);
        this.uriComponents = UriComponentsBuilder.fromUriString(link.getHref()).build();
        this.link = link;
    }

    public TemplateLinkBuilder pagination() {
        link = appendPaginationParameterTemplates(link);
        return this;
    }

    public TemplateLinkBuilder requestParam(String...key) {
        if(key == null) {
            return this;
        }
        for (String s : key) {
            template(s, TemplateVariable.VariableType.REQUEST_PARAM);
        }
        return this;
    }

    public Link link() {
        return link;
    }

    private TemplateLinkBuilder template(String key, TemplateVariable.VariableType type) {
        if(uriComponents.getQueryParams().containsKey(key)) {
            return this;
        }
        String uri = link.getHref();
        UriTemplate uriTemplate = new UriTemplate(uri);

        TemplateVariable templateVariable = new TemplateVariable(key, type);
        TemplateVariables variables = new TemplateVariables(templateVariable);

        link = new Link(uriTemplate.with(variables), link.getRel());

        return this;
    }

    private Link appendPaginationParameterTemplates(Link link) {

        Assert.notNull(link, "Link must not be null!");

        String uri = link.getHref();
        UriTemplate uriTemplate = new UriTemplate(uri);
        UriComponents uriComponents = UriComponentsBuilder.fromUriString(uri).build();

        TemplateVariables variables = pageableResolver.getPaginationTemplateVariables(null, uriComponents);

        return new Link(uriTemplate.with(variables), link.getRel());
    }
}
