package myreader.resource.subscriptionentry.beans;

import java.util.Date;

import org.springframework.hateoas.ResourceSupport;

import spring.hateoas.annotation.Rel;

/**
 * @author Kamill Sokol
 */
@Rel("subscriptionEntries")
public class SubscriptionEntryGetResponse extends ResourceSupport {

    private String title;
    private String feedTitle;
    private String tag;
    private String content;
    private boolean seen;
    private Date createdAt;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getFeedTitle() {
        return feedTitle;
    }

    public void setFeedTitle(String feedTitle) {
        this.feedTitle = feedTitle;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public boolean isSeen() {
        return seen;
    }

    public void setSeen(boolean unseen) {
        this.seen = unseen;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

}
