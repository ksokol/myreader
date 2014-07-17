package myreader.resource.subscriptionentry.assembler;

import myreader.resource.subscriptionentry.SubscriptionEntryCollectionResource;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.*;
import org.springframework.hateoas.core.AbstractEntityLinks;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

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
        return linkTo(SubscriptionEntryCollectionResource.class);
    }

    @Override
    public LinkBuilder linkFor(Class<?> type, Object... parameters) {
        return linkFor(type).slash(parameters[0]);
    }

    @Override
    public Link linkToCollectionResource(Class<?> type) {
        Link link = linkFor(type).withRel("subscriptionEntries");
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
        return SubscriptionEntryGetResponse.class.isAssignableFrom(delimiter);
    }
}
