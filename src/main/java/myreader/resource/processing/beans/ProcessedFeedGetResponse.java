package myreader.resource.processing.beans;

import spring.hateoas.UUIDResourceSupport;

import java.util.Date;

/**
 * @author Kamill Sokol
 */
public class ProcessedFeedGetResponse extends UUIDResourceSupport {

    private String title;
    private String origin;
    private String lastModified;
    private Integer fetched;
    private Date createdAt;

    public String getTitle() {
        return title;
    }

    public void setTitle(final String title) {
        this.title = title;
    }

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(final String origin) {
        this.origin = origin;
    }

    public String getLastModified() {
        return lastModified;
    }

    public void setLastModified(final String lastModified) {
        this.lastModified = lastModified;
    }

    public Integer getFetched() {
        return fetched;
    }

    public void setFetched(final Integer fetched) {
        this.fetched = fetched;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(final Date createdAt) {
        this.createdAt = createdAt;
    }
}
