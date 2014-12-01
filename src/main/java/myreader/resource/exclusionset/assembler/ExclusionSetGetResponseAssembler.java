package myreader.resource.exclusionset.assembler;

import myreader.entity.ExclusionSet;
import myreader.resource.exclusionset.beans.ExclusionSetGetResponse;
import myreader.resource.subscription.beans.SubscriptionGetResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Link;
import org.springframework.stereotype.Component;
import spring.hateoas.AbstractResourceAssembler;
import spring.hateoas.EntityLinks;

/**
 * @author Kamill Sokol
 */
@Component
public class ExclusionSetGetResponseAssembler extends AbstractResourceAssembler<ExclusionSet, ExclusionSetGetResponse> {

    private final EntityLinks entityLinks;

    @Autowired
    public ExclusionSetGetResponseAssembler(EntityLinks entityLinks) {
        super(ExclusionSet.class, ExclusionSetGetResponse.class);
        this.entityLinks = entityLinks;
    }

    @Override
    public ExclusionSetGetResponse toResource(ExclusionSet source) {
        ExclusionSetGetResponse target = new ExclusionSetGetResponse();

        target.setUuid(String.valueOf(source.getSubscriptionId()));
        target.setPatternCount(source.getPatternCount());
        target.setOverallPatternHits(source.getOverallPatternHitCount());

        Link self = entityLinks.linkToSingleResource(ExclusionSetGetResponse.class, source.getSubscriptionId());
        target.add(self);
        Link subscription = entityLinks.linkForSingleResource(SubscriptionGetResponse.class, source.getSubscriptionId()).withRel("subscription");
        target.add(subscription);
        Link pattern = entityLinks.linkFor(ExclusionSetGetResponse.class).slash(source.getSubscriptionId()).slash("pattern").withRel("pattern");
        target.add(pattern);

        return target;
    }
}
