package myreader.resource.subscriptionentry.assembler;

import myreader.entity.SearchableSubscriptionEntry;
import myreader.resource.subscription.beans.SubscriptionGetResponse;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityLinks;
import org.springframework.hateoas.Link;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import spring.data.AbstractResourceAssembler;

/**
 * @author Kamill Sokol
 */
@Component
public class SearchableSubscriptionEntryGetResponseAssembler extends AbstractResourceAssembler<SearchableSubscriptionEntry, SubscriptionEntryGetResponse> {

    private final EntityLinks entityLinks;

    @Autowired
	public SearchableSubscriptionEntryGetResponseAssembler(EntityLinks entityLinks) {
		super(SearchableSubscriptionEntry.class, SubscriptionEntryGetResponse.class);
        this.entityLinks = entityLinks;
    }

	@Override
	public SubscriptionEntryGetResponse toResource(SearchableSubscriptionEntry source) {
		SubscriptionEntryGetResponse target = new SubscriptionEntryGetResponse();

		target.setTag(source.getTag());
		target.setCreatedAt(source.getCreatedAt());
		target.setTitle(source.getTitle());
		target.setContent(source.getContent());
		target.setFeedTitle(source.getSubscriptionTitle());
        target.setSeen(source.isSeen());

		addLinks(source, target);
		return target;
	}

	private void addLinks(SearchableSubscriptionEntry source, SubscriptionEntryGetResponse target) {
		Link self = entityLinks.linkToSingleResource(getOutputClass(), source.getId()).withSelfRel();
		target.add(self);

		if(source.getSubscriptionId() != null) {
			Link subscription = entityLinks.linkToSingleResource(SubscriptionGetResponse.class, source.getSubscriptionId()).withRel("subscription");
			target.add(subscription);
		}

		if(StringUtils.hasText(source.getUrl())) {
			target.add(new Link(source.getUrl(), "origin"));
		}
	}
}
