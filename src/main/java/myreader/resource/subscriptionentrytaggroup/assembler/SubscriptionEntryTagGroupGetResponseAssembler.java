package myreader.resource.subscriptionentrytaggroup.assembler;

import myreader.entity.SubscriptionEntryTagGroup;
import myreader.resource.subscriptionentrytaggroup.beans.SubscriptionEntryTagGroupGetResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Link;
import org.springframework.stereotype.Component;

import spring.hateoas.AbstractResourceAssembler;
import spring.hateoas.EntityLinks;

/**
 * @author Kamill Sokol
 */
@Component
public class SubscriptionEntryTagGroupGetResponseAssembler extends AbstractResourceAssembler<SubscriptionEntryTagGroup, SubscriptionEntryTagGroupGetResponse> {

    private final EntityLinks entityLinks;

    @Autowired
    protected SubscriptionEntryTagGroupGetResponseAssembler(EntityLinks entityLinks) {
        super(SubscriptionEntryTagGroup.class, SubscriptionEntryTagGroupGetResponse.class);
        this.entityLinks = entityLinks;
    }

    @Override
    public SubscriptionEntryTagGroupGetResponse toResource(SubscriptionEntryTagGroup source) {
        SubscriptionEntryTagGroupGetResponse target = new SubscriptionEntryTagGroupGetResponse();

        target.setTag(source.getTag());
        target.setCount(source.getCount());

        Link entries = entityLinks.linkFor(getOutputClass(), source.getTag()).slash("entries").withRel("entries(tag==~ /.+/)");
        target.add(entries);

        return target;
    }
}
