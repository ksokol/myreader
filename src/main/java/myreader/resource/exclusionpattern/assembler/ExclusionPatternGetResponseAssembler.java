package myreader.resource.exclusionpattern.assembler;

import myreader.entity.ExclusionPattern;
import myreader.resource.exclusionpattern.beans.ExclusionPatternGetResponse;
import myreader.resource.exclusionset.beans.ExclusionSetGetResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityLinks;
import org.springframework.hateoas.Link;
import org.springframework.stereotype.Component;

import spring.hateoas.AbstractResourceAssembler;

/**
 * @author Kamill Sokol
 */
@Component
public class ExclusionPatternGetResponseAssembler extends AbstractResourceAssembler<ExclusionPattern, ExclusionPatternGetResponse> {

    private final EntityLinks entityLinks;

    @Autowired
    public ExclusionPatternGetResponseAssembler(EntityLinks entityLinks) {
        super(ExclusionPattern.class, ExclusionPatternGetResponse.class);
        this.entityLinks = entityLinks;
    }

    @Override
    public ExclusionPatternGetResponse toResource(ExclusionPattern source) {
        ExclusionPatternGetResponse target = new ExclusionPatternGetResponse();

        target.setPattern(source.getPattern());
        target.setHitCount(source.getHitCount());

        Link self = entityLinks.linkFor(ExclusionPatternGetResponse.class, source.getSubscription().getId(), source.getId()).withSelfRel();
        target.add(self);
        Link exclusionSet = entityLinks.linkForSingleResource(ExclusionSetGetResponse.class, source.getSubscription().getId()).withRel("exclusion");
        target.add(exclusionSet);

        return target;
    }
}
