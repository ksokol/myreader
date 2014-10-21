package myreader.resource.subscriptionentrytaggroup.beans;

import org.springframework.hateoas.ResourceSupport;

import spring.hateoas.annotation.Rel;

/**
 * @author Kamill Sokol
 */
@Rel("subscriptionEntryTagGroups")
public class SubscriptionEntryTagGroupGetResponse extends ResourceSupport {

    private String tag;
    private long count;

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }
}
