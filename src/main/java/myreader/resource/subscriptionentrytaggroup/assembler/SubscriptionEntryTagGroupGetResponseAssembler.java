package myreader.resource.subscriptionentrytaggroup.assembler;

import myreader.entity.SubscriptionEntryTagGroup;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import myreader.resource.subscriptionentrytaggroup.beans.SubscriptionEntryTagGroupGetResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Link;
import org.springframework.stereotype.Component;
import spring.hateoas.AbstractResourceAssembler;
import spring.hateoas.EntityLinks;

import static myreader.utils.UrlUtils.encodeAsUTF8;

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

        target.setUuid(source.getTag());
        target.setTag(source.getTag());
        target.setCount(source.getCount());

        Link entries = entityLinks.linkFor(SubscriptionEntryGetResponse.class).slash("tag").slash(encodeAsUTF8(source.getTag())).withRel("entries");
        target.add(entries);

        return target;
    }
}
