package myreader.resource.feed.beans;

import org.springframework.hateoas.ResourceSupport;

import java.util.Date;

/**
 * @author Kamill Sokol
 */
@SuppressWarnings("PMD.UselessOverridingMethod")
public class FetchErrorGetResponse extends ResourceSupport {

    private String uuid;
    private String message;
    private int retainDays;
    private Date createdAt;

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getRetainDays() {
        return retainDays;
    }

    public void setRetainDays(int retainDays) {
        this.retainDays = retainDays;
    }

    public Date getCreatedAt() {
        return new Date(createdAt.getTime());
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
