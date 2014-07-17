package myreader.resource.user.assembler;

import myreader.resource.user.UserCollectionResource;
import myreader.resource.user.UserEntityResource;
import myreader.resource.user.beans.UserGetResponse;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.LinkBuilder;
import org.springframework.hateoas.core.AbstractEntityLinks;
import org.springframework.hateoas.mvc.ControllerLinkBuilder;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

/**
 * @author Kamill Sokol
 */
public class UserGetResponseEntityLinks extends AbstractEntityLinks {

    private final PagedResourcesAssembler pagedResourcesAssembler;

    public UserGetResponseEntityLinks(PagedResourcesAssembler pagedResourcesAssembler) {
        this.pagedResourcesAssembler = pagedResourcesAssembler;
    }

    @Override
    public LinkBuilder linkFor(Class<?> type) {
        return linkTo(methodOn(UserCollectionResource.class).get(null, null));
    }

    @Override
    public LinkBuilder linkFor(Class<?> type, Object... parameters) {
        return linkTo(methodOn(UserCollectionResource.class).userSubscriptions((Long) parameters[0], null, null));
    }

    @Override
    public Link linkToCollectionResource(Class<?> type) {
        Link link = linkFor(type).withRel("users");
        return pagedResourcesAssembler.appendPaginationParameterTemplates(link);
    }

    @Override
    public Link linkToSingleResource(Class<?> type, Object id) {
        return linkTo(methodOn(UserEntityResource.class).get((Long) id, null)).withRel("self");
    }

    @Override
    public boolean supports(Class<?> delimiter) {
        return UserGetResponse.class.isAssignableFrom(delimiter);
    }
}
