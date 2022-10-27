package myreader.resource.subscriptionentry.beans;

import java.time.OffsetDateTime;
import java.util.Set;

public class SubscriptionEntryGetResponse {

    private String uuid;
    private String title;
    private String feedTitle;
    private String feedUuid;
    private String content;
    private boolean seen;
    private String origin;
    private String feedTag;
    private String feedTagColor;
    private OffsetDateTime createdAt;

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

    public String getFeedTitle() {
        return feedTitle;
    }

    public void setFeedTitle(String feedTitle) {
        this.feedTitle = feedTitle;
    }

    public String getFeedUuid() {
        return feedUuid;
    }

    public void setFeedUuid(String feedUuid) {
        this.feedUuid = feedUuid;
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

    public void setSeen(boolean seen) {
        this.seen = seen;
    }

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    public String getFeedTag() {
        return feedTag;
    }

    public void setFeedTag(String feedTag) {
        this.feedTag = feedTag;
    }

    public String getFeedTagColor() {
        return feedTagColor;
    }

    public void setFeedTagColor(String feedTagColor) {
        this.feedTagColor = feedTagColor;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
