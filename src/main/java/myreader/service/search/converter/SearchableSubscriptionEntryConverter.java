package myreader.service.search.converter;

import org.apache.commons.lang.StringUtils;
import org.springframework.core.convert.converter.Converter;

import myreader.entity.SearchableSubscriptionEntry;
import myreader.entity.SubscriptionEntry;

/**
 * @author Kamill Sokol
 */
public class SearchableSubscriptionEntryConverter implements Converter<SubscriptionEntry, SearchableSubscriptionEntry> {

	@Override
	public SearchableSubscriptionEntry convert(SubscriptionEntry source) {
		SearchableSubscriptionEntry target = new SearchableSubscriptionEntry();

		target.setId(source.getId());
		target.setOwner(source.getSubscription().getUser().getEmail());
		target.setTitle(source.getFeedEntry().getTitle());
		target.setOwnerId(source.getSubscription().getUser().getId());
		target.setSubscriptionId(source.getSubscription().getId());
		target.setSubscriptionTitle(source.getSubscription().getTitle());
		target.setContent(source.getFeedEntry().getContent());
		target.setSeen(source.isSeen());
		target.setTag(StringUtils.defaultIfEmpty(source.getTag(), "*"));
		target.setFeedTag(StringUtils.defaultIfEmpty(source.getSubscription().getTag(), "*"));
		target.setCreatedAt(source.getCreatedAt());
		target.setUrl(source.getFeedEntry().getUrl());

		return target;
	}
}
