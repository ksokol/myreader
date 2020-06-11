package myreader.resource.subscriptionentry.beans;

import java.util.List;

/**
 * @author Kamill Sokol
 */
public class SubscriptionEntryBatchPatchRequest {

    private List<SubscriptionEntryPatchRequest> content;

    public List<SubscriptionEntryPatchRequest> getContent() {
        return content;
    }

    public void setContent(final List<SubscriptionEntryPatchRequest> content) {
        this.content = content;
    }
}
