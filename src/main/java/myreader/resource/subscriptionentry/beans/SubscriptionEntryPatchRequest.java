package myreader.resource.subscriptionentry.beans;

import myreader.resource.service.patch.PatchSupport;

/**
 * @author Kamill Sokol
 */
public class SubscriptionEntryPatchRequest extends PatchSupport {

    private String tag;
    private Boolean seen;

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public Boolean getSeen() {
        return seen;
    }

    public void setSeen(Boolean seen) {
        this.seen = seen;
    }
}
