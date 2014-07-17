package myreader.resource.subscriptiontaggroup.assembler;

import myreader.resource.subscriptiontaggroup.SubscriptionTagGroupCollectionResource;
import myreader.resource.subscriptiontaggroup.beans.SubscriptionTagGroupGetResponse;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.*;
import org.springframework.hateoas.core.AbstractEntityLinks;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

/**
 * @author Kamill Sokol
 */
public class SubscriptionTagGroupEntityLinks extends AbstractEntityLinks {

    private final PagedResourcesAssembler pagedResourcesAssembler;

    public SubscriptionTagGroupEntityLinks(PagedResourcesAssembler pagedResourcesAssembler) {
        this.pagedResourcesAssembler = pagedResourcesAssembler;
    }

    @Override
    public LinkBuilder linkFor(Class<?> type) {
        return linkTo(SubscriptionTagGroupCollectionResource.class);
    }

    @Override
    public LinkBuilder linkFor(Class<?> type, Object... parameters) {
        return linkFor(type).slash(encodeAsUTF8(parameters[0]));
    }

    @Override
    public Link linkToCollectionResource(Class<?> type) {
        Link link = linkFor(type).withRel("subscriptionTagGroups");
        Link linkParam = pagedResourcesAssembler.appendPaginationParameterTemplates(link);

        String uri = linkParam.getHref();
        UriTemplate uriTemplate = new UriTemplate(uri);

        TemplateVariable templateVariable = new TemplateVariable("q", TemplateVariable.VariableType.REQUEST_PARAM);
        TemplateVariables variables = new TemplateVariables(templateVariable);

        return new Link(uriTemplate.with(variables), linkParam.getRel());
    }

    @Override
    public Link linkToSingleResource(Class<?> type, Object id) {
        return linkFor(type, id).withSelfRel();
    }

    @Override
    public boolean supports(Class<?> delimiter) {
        return SubscriptionTagGroupGetResponse.class.isAssignableFrom(delimiter);
    }

    private static String encodeAsUTF8(Object toEncode) {
        try {
            return URLEncoder.encode(String.valueOf(toEncode), "UTF-8");
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }
}
