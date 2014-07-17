package myreader.resource.subscriptionentry.assembler;

import myreader.entity.SearchableSubscriptionEntry;
import spring.data.AbstractResourceAssembler;
import myreader.resource.subscription.SubscriptionEntityResource;
import myreader.resource.subscriptionentry.SubscriptionEntryResource;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import org.springframework.hateoas.Link;
import org.springframework.util.StringUtils;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

/**
 * @author Kamill Sokol
 */
public class SearchableSubscriptionEntryGetResponseAssembler extends AbstractResourceAssembler<SearchableSubscriptionEntry, SubscriptionEntryGetResponse> {

	public SearchableSubscriptionEntryGetResponseAssembler() {
		super(SearchableSubscriptionEntry.class, SubscriptionEntryGetResponse.class);
	}

	@Override
	public SubscriptionEntryGetResponse toResource(SearchableSubscriptionEntry source) {
		SubscriptionEntryGetResponse target = new SubscriptionEntryGetResponse();

		target.setTag(source.getTag());
		target.setCreatedAt(source.getCreatedAt());
		target.setTitle(source.getTitle());
		target.setContent(source.getContent());
		target.setFeedTitle(source.getSubscriptionTitle());

		addLinks(source, target);
		return target;
	}

	private void addLinks(SearchableSubscriptionEntry source, SubscriptionEntryGetResponse target) {
		Link self = linkTo(SubscriptionEntryResource.class).slash(source.getId()).withSelfRel();
		target.add(self);

		if(source.getSubscriptionId() != null) {
			Link subscription = linkTo(SubscriptionEntityResource.class).slash(source.getSubscriptionId()).withRel("subscription");
			target.add(subscription);
		}

		if(StringUtils.hasText(source.getUrl())) {
			target.add(new Link(source.getUrl(), "origin"));
		}
	}
}
