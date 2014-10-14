package myreader.resource.exclusionpattern.assembler;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

import myreader.resource.exclusionpattern.ExclusionPatternEntityResource;
import myreader.resource.exclusionpattern.beans.ExclusionPatternGetResponse;

import org.springframework.hateoas.LinkBuilder;
import org.springframework.stereotype.Component;

import spring.data.EntityLinksSupport;

/**
 * @author Kamill Sokol
 */
@Component
public class ExclusionPatternEntityLinks extends EntityLinksSupport {

    public ExclusionPatternEntityLinks() {
        super(ExclusionPatternGetResponse.class, ExclusionPatternEntityResource.class);
    }

    @Override
    public LinkBuilder linkFor(Class<?> type, Object... parameters) {
        return linkTo(getResourceClass(), parameters);
    }
}
