package myreader.resource.exclusionpattern.assembler;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

import myreader.resource.exclusionpattern.ExclusionPatternEntityResource;
import myreader.resource.exclusionpattern.beans.ExclusionPatternGetResponse;

import org.springframework.hateoas.LinkBuilder;

import spring.hateoas.EntityLinker;

/**
 * @author Kamill Sokol
 */
public class ExclusionPatternEntityLinks extends EntityLinker {

    public ExclusionPatternEntityLinks() {
        super(ExclusionPatternGetResponse.class, ExclusionPatternEntityResource.class);
    }

    @Override
    public LinkBuilder linkFor(Class<?> type, Object... parameters) {
        return linkTo(getResourceClass(), parameters);
    }
}
