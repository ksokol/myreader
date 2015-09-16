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
        return new Date(createdAt.getTime());
    }

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(final String origin) {
        this.origin = origin;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = new Date(createdAt.getTime());
    }

    @Override
    public int hashCode() {
        return getUuid().hashCode();
    }

    @Override
    public boolean equals(final Object object) {
        if (this == object) {
            return true;
        }

        if (object == null || !object.getClass().equals(this.getClass())) {
            return false;
        }

        SubscriptionGetResponse that = (SubscriptionGetResponse) object;

        return this.getUuid().equals(that.getUuid());
    }

}
