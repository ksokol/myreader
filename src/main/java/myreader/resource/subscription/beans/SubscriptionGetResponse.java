package myreader.resource.subscription.beans;

import spring.hateoas.UUIDResourceSupport;
import spring.hateoas.annotation.Rel;

import java.util.Date;

/**
 * @author Kamill Sokol
 */
@Rel("subscriptions")
public class SubscriptionGetResponse extends UUIDResourceSupport {

    private String title;
    private String tag;
    private int sum;
    private long unseen;
    private Date createdAt;

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

    public int getSum() {
        return sum;
    }

    public void setSum(int sum) {
        this.sum = sum;
    }

    public long getUnseen() {
        return unseen;
    }

    public void setUnseen(long unseen) {
        this.unseen = unseen;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

}
