package myreader.resource.subscriptiontag.assembler;

import myreader.entity.SubscriptionTag;
import myreader.resource.subscriptiontag.beans.SubscriptionTagGetResponse;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.stereotype.Component;

/**
 * @author Kamill Sokol
 */
@Component
public class SubscriptionTagGetResponseAssembler extends RepresentationModelAssemblerSupport<SubscriptionTag, SubscriptionTagGetResponse> {

    public SubscriptionTagGetResponseAssembler() {
        super(SubscriptionTag.class, SubscriptionTagGetResponse.class);
    }

    @Override
    public SubscriptionTagGetResponse toModel(SubscriptionTag source) {
        SubscriptionTagGetResponse target = new SubscriptionTagGetResponse();

        target.setUuid(source.getId().toString());
        target.setName(source.getName());
        target.setColor(source.getColor());
        target.setCreatedAt(source.getCreatedAt());

        return target;
    }
}
