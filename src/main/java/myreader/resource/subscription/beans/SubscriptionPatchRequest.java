package myreader.resource.subscription.beans;

import myreader.resource.service.patch.PatchSupport;

/**
 * @author Kamill Sokol
 */
public class SubscriptionPatchRequest extends PatchSupport {

    private String title;
    private String tag;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }
}
