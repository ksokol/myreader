package myreader.resource.subscription.beans;

import java.util.Date;

import org.springframework.hateoas.ResourceSupport;

import spring.hateoas.annotation.Rel;

/**
 * @author Kamill Sokol
 */
@Rel("subscriptions")
public class SubscriptionGetResponse extends ResourceSupport {

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
