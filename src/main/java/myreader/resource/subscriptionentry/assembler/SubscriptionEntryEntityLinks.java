package myreader.resource.subscriptionentry.assembler;

import myreader.resource.subscriptionentry.SubscriptionEntryCollectionResource;
import myreader.resource.subscriptionentry.SubscriptionEntryResource;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.*;
import org.springframework.hateoas.core.AbstractEntityLinks;
import org.springframework.hateoas.mvc.ControllerLinkBuilder;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

/**
 * @author Kamill Sokol
 */
public class SubscriptionEntryEntityLinks extends AbstractEntityLinks {

    private final PagedResourcesAssembler pagedResourcesAssembler;

    public SubscriptionEntryEntityLinks(PagedResourcesAssembler pagedResourcesAssembler) {
        this.pagedResourcesAssembler = pagedResourcesAssembler;
    }

    @Override
    public LinkBuilder linkFor(Class<?> type) {
        return getLinkBuilder();
    }

    @Override
    public LinkBuilder linkFor(Class<?> type, Object... parameters) {
        return linkFor(type).slash(parameters[0]);
    }

    @Override
    public Link linkToCollectionResource(Class<?> type) {
        Link link = ControllerLinkBuilder.linkTo(methodOn(SubscriptionEntryCollectionResource.class).get(null, null)).withRel("subscriptionEntries");
        Link linkParam = pagedResourcesAssembler.appendPaginationParameterTemplates(link);

        String uri = linkParam.getHref();
        UriTemplate uriTemplate = new UriTemplate(uri);

        TemplateVariable templateVariable = new TemplateVariable("q", TemplateVariable.VariableType.REQUEST_PARAM);
        TemplateVariables variables = new TemplateVariables(templateVariable);

        return new Link(uriTemplate.with(variables), linkParam.getRel());
    }

    private LinkBuilder getLinkBuilder() {
        return linkTo(methodOn(SubscriptionEntryCollectionResource.class).searchAndFilterBySubscription("", null, null));
    }

    @Override
    public Link linkToSingleResource(Class<?> type, Object id) {
        return linkTo(SubscriptionEntryResource.class).slash(id).withSelfRel();
    }

    @Override
    public boolean supports(Class<?> delimiter) {
        return SubscriptionEntryGetResponse.class.isAssignableFrom(delimiter);
    }
}
