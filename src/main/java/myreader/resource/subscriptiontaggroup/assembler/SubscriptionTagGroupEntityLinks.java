package myreader.resource.subscriptiontaggroup.assembler;

import myreader.resource.subscriptiontaggroup.SubscriptionTagGroupCollectionResource;
import myreader.resource.subscriptiontaggroup.SubscriptionTagGroupEntityResource;
import myreader.resource.subscriptiontaggroup.beans.SubscriptionTagGroupGetResponse;
import myreader.resource.utils.EncodeUtils;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.LinkBuilder;
import org.springframework.hateoas.TemplateVariable;
import org.springframework.hateoas.TemplateVariables;
import org.springframework.hateoas.UriTemplate;
import org.springframework.hateoas.core.AbstractEntityLinks;
import org.springframework.hateoas.mvc.ControllerLinkBuilder;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

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
        return linkTo(methodOn(SubscriptionTagGroupCollectionResource.class).get(null, null));
    }

    @Override
    public LinkBuilder linkFor(Class<?> type, Object... parameters) {
        String encoded = EncodeUtils.encodeAsUTF8((String) parameters[0]);
        return linkTo(methodOn(SubscriptionTagGroupEntityResource.class).get(encoded, null));
    }

    @Override
    public Link linkToCollectionResource(Class<?> type) {
        Link link = ControllerLinkBuilder.linkTo(methodOn(SubscriptionTagGroupCollectionResource.class).get(null, null)).withRel("subscriptionTagGroups");
        Link linkParam = pagedResourcesAssembler.appendPaginationParameterTemplates(link);

        String uri = linkParam.getHref();
        UriTemplate uriTemplate = new UriTemplate(uri);

        TemplateVariable templateVariable = new TemplateVariable("q", TemplateVariable.VariableType.REQUEST_PARAM);
        TemplateVariables variables = new TemplateVariables(templateVariable);

        return new Link(uriTemplate.with(variables), linkParam.getRel());
    }

    @Override
    public Link linkToSingleResource(Class<?> type, Object id) {
        String encoded = EncodeUtils.encodeAsUTF8((String) id);
        return linkTo(methodOn(SubscriptionTagGroupEntityResource.class).get(encoded, null)).withSelfRel();
    }

    @Override
    public boolean supports(Class<?> delimiter) {
        return SubscriptionTagGroupGetResponse.class.isAssignableFrom(delimiter);
    }
}
