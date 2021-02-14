package myreader.resource.subscriptionentry.beans;

import java.util.Date;
import java.util.Set;

public class SubscriptionEntryGetResponse {

    private String uuid;
    private String title;
    private String feedTitle;
    private String feedUuid;
    private Set<String> tags;
    private String content;
    private boolean seen;
    private String origin;
    private String feedTag;
    private String feedTagColor;
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

    public Set<String> getTags() {
        return tags;
    }

    public void setTags(final Set<String> tags) {
        this.tags = tags;
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

    public String getFeedTagColor() {
        return feedTagColor;
    }

    public void setFeedTagColor(String feedTagColor) {
        this.feedTagColor = feedTagColor;
    }

    public Date getCreatedAt() {
        return new Date(createdAt.getTime());
    }

    public void setCreatedAt(final Date createdAt) {
        this.createdAt = new Date(createdAt.getTime());
    }
}
