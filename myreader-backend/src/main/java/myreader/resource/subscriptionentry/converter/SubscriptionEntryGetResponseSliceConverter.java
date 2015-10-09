package myreader.resource.subscriptionentry.converter;

import myreader.entity.SubscriptionEntry;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponseSlice;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @author Kamill Sokol
 */
@Component
public class SubscriptionEntryGetResponseSliceConverter {

    private final SubscriptionEntryGetResponseConverter subscriptionEntryGetResponseConverter;

    @Autowired
    public SubscriptionEntryGetResponseSliceConverter(final SubscriptionEntryGetResponseConverter subscriptionEntryGetResponseConverter) {
        Assert.notNull(subscriptionEntryGetResponseConverter, "subscriptionEntryGetResponseConverter is null");
        this.subscriptionEntryGetResponseConverter = subscriptionEntryGetResponseConverter;
    }

    public SubscriptionEntryGetResponseSlice convert(Slice<SubscriptionEntry> source, final Map<String, Object> params) {
        final SubscriptionEntryGetResponseSlice target = new SubscriptionEntryGetResponseSlice();
        final List<SubscriptionEntryGetResponse> contents = new ArrayList<>(10);

        target.setContent(contents);
        target.setQuery(params);

        params.remove("next");

        if(CollectionUtils.isEmpty(source.getContent())) {
            return target;
        }

        final List<SubscriptionEntry> content = source.getContent();

        int size = params.get("size") == null ? 10 : Integer.parseInt(params.get("size").toString());
        int limit = size < 2 ? 1 : size - 1;

        content.stream().limit(limit).forEach(subscriptionEntry -> {
            final SubscriptionEntryGetResponse subscriptionEntryGetResponse = subscriptionEntryGetResponseConverter.toResource(subscriptionEntry);
            contents.add(subscriptionEntryGetResponse);
        });

        if(source.getContent().size() > limit) {
            final SubscriptionEntry subscriptionEntryGetResponse = source.getContent().get(source.getContent().size() - 1);
            params.put("next", String.valueOf(subscriptionEntryGetResponse.getId()));
        }

        return target;
    }
}
