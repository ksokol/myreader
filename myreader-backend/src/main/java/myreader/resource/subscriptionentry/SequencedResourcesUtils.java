package myreader.resource.subscriptionentry;

import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import org.apache.commons.lang3.StringUtils;
import org.springframework.hateoas.Link;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;
import spring.hateoas.SequencedResources;

import java.util.ArrayList;
import java.util.List;

import static org.springframework.web.util.UriComponentsBuilder.fromUriString;

/**
 * @author Kamill Sokol
 */
final class SequencedResourcesUtils {

    private static final String DEFAULT_NEXT_PARAMETER = "next";
    private static final String DEFAULT_SIZE_PARAMETER = "size";

    protected static SequencedResources<SubscriptionEntryGetResponse> toSequencedResources(final int pageSize, List<SubscriptionEntryGetResponse> entries) {
        Long nextId = getNextId(pageSize, entries);
        SequencedResources<SubscriptionEntryGetResponse> pagedResources = new SequencedResources<>(entries);
        List<Link> links = addPaginationLinks(nextId, pageSize);

        pagedResources.add(links);

        return pagedResources;
    }

    private static Long getNextId(final int pageSize, List<SubscriptionEntryGetResponse> entries) {
        boolean hasNext = entries.size() >= pageSize;

        if (!hasNext) {
            return null;
        }

        SubscriptionEntryGetResponse entry = entries.get(entries.size() -1);
        long last = Long.parseLong(entry.getUuid()); //TODO
        return last - 1;
    }

    private static List<Link> addPaginationLinks(Long nextId, long pageSize) {
        List<Link> links = new ArrayList<>(2);
        if (nextId != null) {
            links.add(createLink(nextId, pageSize, Link.REL_NEXT));
        }

        links.add(new Link(getRelativeUriString()));

        return links;
    }

    private static Link createLink(Long nextId, long pageSize, String rel) {
        UriComponentsBuilder builder = fromUriString(getRelativeUriString());
        enhance(builder, nextId, pageSize);
        return new Link(builder.build().toUriString(), rel);
    }

    private static String getRelativeUriString() {
        final UriComponents uriComponents = ServletUriComponentsBuilder.fromCurrentRequest().build();
        String query = StringUtils.defaultString(uriComponents.getQuery());

        if(StringUtils.isNotEmpty(query)) {
            query = "?" + query;
        }

        return uriComponents.getPath() + query;
    }

    private static void enhance(final UriComponentsBuilder builder, Long nextId, long pageSize) {
        if(nextId != null) {
            builder.replaceQueryParam(DEFAULT_NEXT_PARAMETER, nextId);
        }
        builder.replaceQueryParam(DEFAULT_SIZE_PARAMETER, pageSize);
    }
}
