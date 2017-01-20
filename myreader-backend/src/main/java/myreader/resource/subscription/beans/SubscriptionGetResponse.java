package myreader.resource.subscription.beans;

import org.springframework.hateoas.ResourceSupport;

import java.util.Date;

/**
 * @author Kamill Sokol
 */
@SuppressWarnings("PMD.UselessOverridingMethod")
public class SubscriptionGetResponse extends ResourceSupport {

    private String uuid;
    private String title;
    private String tag;
    private int sum;
    private long unseen;
    private String origin;
    private Date createdAt;

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

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
    public boolean equals(Object o) {
        return super.equals(o);
    }

    @Override
    public int hashCode() {
        return super.hashCode();
    }
}
