package myreader.resource.subscriptionentry.assembler;

import org.springframework.stereotype.Component;

import myreader.entity.SearchableSubscriptionEntry;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import spring.hateoas.AbstractResourceAssembler;

/**
 * @author Kamill Sokol
 */
@Component
public class SearchableSubscriptionEntryGetResponseAssembler extends AbstractResourceAssembler<SearchableSubscriptionEntry, SubscriptionEntryGetResponse> {

	public SearchableSubscriptionEntryGetResponseAssembler() {
		super(SearchableSubscriptionEntry.class, SubscriptionEntryGetResponse.class);
    }

	@Override
	public SubscriptionEntryGetResponse toResource(SearchableSubscriptionEntry source) {
		SubscriptionEntryGetResponse target = new SubscriptionEntryGetResponse();

		target.setUuid(String.valueOf(source.getId()));
		target.setTag(source.getTag());
		target.setCreatedAt(source.getCreatedAt());
		target.setTitle(source.getTitle());
		target.setContent(source.getContent());
		target.setFeedTitle(source.getSubscriptionTitle());
        target.setSeen(source.isSeen());
		target.setFeedUuid(String.valueOf(source.getSubscriptionId()));
		target.setFeedTag("*".equals(source.getFeedTag()) ? null : source.getFeedTag());
		target.setOrigin(source.getUrl());

		return target;
	}

}
