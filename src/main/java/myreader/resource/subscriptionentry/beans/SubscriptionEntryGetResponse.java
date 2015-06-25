package myreader.resource.subscriptionentry.beans;

import spring.hateoas.UUIDResourceSupport;

import java.util.Date;

/**
 * @author Kamill Sokol
 */
public class SubscriptionEntryGetResponse extends UUIDResourceSupport {

    private String title;
    private String feedTitle;
    private String feedUuid;
    private String tag;
    private String content;
    private boolean seen;
    private String origin;
    private String feedTag;
    private Date createdAt;

    public String getTitle() {
        return title;
    }

    public void setTitle(final String title) {
        this.title = title;
    }

    public String getFeedTitle() {
        return feedTitle;
    }

    public void setFeedTitle(final String feedTitle) {
        this.feedTitle = feedTitle;
    }

    public String getFeedUuid() {
        return feedUuid;
    }

    public void setFeedUuid(final String feedUuid) {
        this.feedUuid = feedUuid;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(final String tag) {
        this.tag = tag;
    }

    public String getContent() {
        return content;
    }

    public void setContent(final String content) {
        this.content = content;
    }

    public boolean isSeen() {
        return seen;
    }

    public void setSeen(final boolean seen) {
        this.seen = seen;
    }

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(final String origin) {
        this.origin = origin;
    }

    public String getFeedTag() {
        return feedTag;
    }

    public void setFeedTag(final String feedTag) {
        this.feedTag = feedTag;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(final Date createdAt) {
        this.createdAt = createdAt;
    }
}
