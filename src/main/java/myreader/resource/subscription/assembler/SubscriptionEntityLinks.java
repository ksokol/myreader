package myreader.resource.subscription.assembler;

import myreader.resource.subscription.SubscriptionCollectionResource;
import myreader.resource.subscription.SubscriptionEntityResource;
import myreader.resource.subscription.beans.SubscriptionGetResponse;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.LinkBuilder;
import org.springframework.hateoas.core.AbstractEntityLinks;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

/**
 * @author Kamill Sokol
 */
public class SubscriptionEntityLinks extends AbstractEntityLinks {

    private final PagedResourcesAssembler pagedResourcesAssembler;

    public SubscriptionEntityLinks(PagedResourcesAssembler pagedResourcesAssembler) {
        this.pagedResourcesAssembler = pagedResourcesAssembler;
    }

    @Override
    public LinkBuilder linkFor(Class<?> type) {
        return linkTo(methodOn(SubscriptionCollectionResource.class).get(null, null));
    }

    @Override
    public LinkBuilder linkFor(Class<?> type, Object... parameters) {
        return linkTo(methodOn(SubscriptionEntityResource.class).get((Long) parameters[0], null));
    }

    @Override
    public Link linkToCollectionResource(Class<?> type) {
        Link link = linkTo(methodOn(SubscriptionCollectionResource.class).get(null, null)).withRel("subscriptions");
        return pagedResourcesAssembler.appendPaginationParameterTemplates(link);
    }

    @Override
    public Link linkToSingleResource(Class<?> type, Object id) {
        return linkTo(methodOn(SubscriptionEntityResource.class).get((Long) id, null)).withSelfRel();
    }

    @Override
    public boolean supports(Class<?> delimiter) {
        return SubscriptionGetResponse.class.isAssignableFrom(delimiter);
    }
}
