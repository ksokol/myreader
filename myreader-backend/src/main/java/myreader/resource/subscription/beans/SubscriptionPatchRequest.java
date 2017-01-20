package myreader.resource.subscription.beans;

import org.hibernate.validator.constraints.NotBlank;

/**
 * @author Kamill Sokol
 */
public class SubscriptionPatchRequest {

    @NotBlank(message = "may not be empty")
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
