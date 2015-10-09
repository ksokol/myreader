package myreader.resource.subscriptionentry.beans;

import java.util.List;
import java.util.Map;

/**
 * @author Kamill Sokol
 */
public class SubscriptionEntryGetResponseSlice {

    private List<SubscriptionEntryGetResponse> content;
    private Map<String, Object> query;

    public List<SubscriptionEntryGetResponse> getContent() {
        return content;
    }

    public void setContent(final List<SubscriptionEntryGetResponse> content) {
        this.content = content;
    }

    public Map<String, Object> getQuery() {
        return query;
    }

    public void setQuery(final Map<String, Object> query) {
        this.query = query;
    }
}
