package myreader.resource.subscription.beans;

import myreader.resource.service.patch.PatchSupport;
import org.hibernate.validator.constraints.NotBlank;

/**
 * @author Kamill Sokol
 */
public class SubscriptionPatchRequest extends PatchSupport {

    @NotBlank(message = "may not be empty")
    private String title;
    private String tag;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.addPatchedField("title");
        this.title = title;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.addPatchedField("tag");
        this.tag = tag;
    }
}
