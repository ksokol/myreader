package myreader.resource.feed.beans;

import spring.hateoas.UUIDResourceSupport;

import java.util.Date;
import java.util.Objects;

/**
 * @author Kamill Sokol
 */
public class FeedGetResponse extends UUIDResourceSupport {

    private String title;
    private String url;
    private String lastModified;
    private Integer fetched;
    private boolean hasErrors;
    private Date createdAt;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getLastModified() {
        return lastModified;
    }

    public void setLastModified(String lastModified) {
        this.lastModified = lastModified;
    }

    public Integer getFetched() {
        return fetched;
    }

    public void setFetched(Integer fetched) {
        this.fetched = fetched;
    }

    public boolean isHasErrors() {
        return hasErrors;
    }

    public void setHasErrors(boolean hasErrors) {
        this.hasErrors = hasErrors;
    }

    public Date getCreatedAt() {
        if(createdAt != null) {
            return new Date(createdAt.getTime());
        } else {
            return null;
        }
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = new Date(createdAt.getTime());
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof FeedGetResponse)) return false;
        if (!super.equals(o)) return false;
        FeedGetResponse that = (FeedGetResponse) o;
        return hasErrors == that.hasErrors &&
                Objects.equals(title, that.title) &&
                Objects.equals(url, that.url) &&
                Objects.equals(lastModified, that.lastModified) &&
                Objects.equals(fetched, that.fetched) &&
                Objects.equals(createdAt, that.createdAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), title, url, lastModified, fetched, hasErrors, createdAt);
    }
}
