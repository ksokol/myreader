package myreader.resource.feed.beans;

import org.springframework.hateoas.ResourceSupport;

import java.util.Date;

/**
 * @author Kamill Sokol
 */
public class FeedGetResponse extends ResourceSupport {

    private String uuid;
    private String title;
    private String url;
    private String lastModified;
    private Integer fetched;
    private boolean hasErrors;
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
}
