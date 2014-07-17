package myreader.resource.user.assembler;

import myreader.resource.user.UserEntityResource;
import myreader.resource.user.beans.UserGetResponse;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.LinkBuilder;
import org.springframework.hateoas.core.AbstractEntityLinks;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

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
        return linkTo(UserEntityResource.class);
    }

    @Override
    public LinkBuilder linkFor(Class<?> type, Object... parameters) {
        return linkFor(type).slash(parameters[0]);
    }

    @Override
    public Link linkToCollectionResource(Class<?> type) {
        Link link = linkFor(type).withRel("users");
        return pagedResourcesAssembler.appendPaginationParameterTemplates(link);
    }

    @Override
    public Link linkToSingleResource(Class<?> type, Object id) {
        return linkFor(type, id).withSelfRel();
    }

    @Override
    public boolean supports(Class<?> delimiter) {
        return UserGetResponse.class.isAssignableFrom(delimiter);
    }
}
