package myreader.resource.feed.beans;

import spring.hateoas.UUIDResourceSupport;

import java.util.Date;
import java.util.Objects;

/**
 * @author Kamill Sokol
 */
public class FetchErrorGetResponse extends UUIDResourceSupport {

    private String message;
    private int retainDays;
    private Date createdAt;

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
        if (this == o) return true;
        if (!(o instanceof FetchErrorGetResponse)) return false;
        if (!super.equals(o)) return false;
        FetchErrorGetResponse that = (FetchErrorGetResponse) o;
        return retainDays == that.retainDays &&
                Objects.equals(message, that.message) &&
                Objects.equals(createdAt, that.createdAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), message, retainDays, createdAt);
    }
}
