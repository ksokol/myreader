package myreader.resource.subscription.beans;

import spring.hateoas.UUIDResourceSupport;

import java.util.Date;

/**
 * @author Kamill Sokol
 */
public class SubscriptionGetResponse extends UUIDResourceSupport {

    private String title;
    private String tag;
    private int sum;
    private long unseen;
    private String origin;
    private String icon;
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

    public String getOrigin() {
        return origin;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(final String icon) {
        this.icon = icon;
    }

    public void setOrigin(final String origin) {
        this.origin = origin;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

}
