package myreader.resource.subscriptiontaggroup.beans;

import org.springframework.hateoas.ResourceSupport;

import spring.hateoas.annotation.Rel;

/**
 * @author Kamill Sokol
 */
@Rel("subscriptionTagGroups")
public class SubscriptionTagGroupGetResponse extends ResourceSupport {

    private String tag;
    private long unseen;

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public long getUnseen() {
        return unseen;
    }

    public void setUnseen(long unseen) {
        this.unseen = unseen;
    }
}
