package myreader.resource.exclusionpattern.assembler;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

import myreader.resource.exclusionpattern.ExclusionPatternEntityResource;
import myreader.resource.exclusionpattern.beans.ExclusionPatternGetResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.LinkBuilder;
import org.springframework.stereotype.Component;

import spring.data.EntityLinksSupport;

/**
 * @author Kamill Sokol
 */
@Component
public class ExclusionPatternEntityLinks extends EntityLinksSupport {

    @Autowired
    public ExclusionPatternEntityLinks(PagedResourcesAssembler pagedResourcesAssembler) {
        super(ExclusionPatternGetResponse.class, ExclusionPatternEntityResource.class, pagedResourcesAssembler);
    }

    @Override
    public LinkBuilder linkFor(Class<?> type, Object... parameters) {
        return linkTo(getResourceClass(), parameters);
    }

    @Override
    public Link linkToCollectionResource(Class<?> type) {
        return with(type).pagination().link();
    }
}
