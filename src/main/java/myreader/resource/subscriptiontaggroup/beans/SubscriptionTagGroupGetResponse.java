package myreader.resource.subscriptiontaggroup.beans;

import org.springframework.hateoas.ResourceSupport;

/**
 * @author Kamill Sokol
 */
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
