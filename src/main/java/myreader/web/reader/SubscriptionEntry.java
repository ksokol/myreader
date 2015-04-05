package myreader.web.reader;

import java.util.Date;

import myreader.reader.web.UserEntryQuery;

public class SubscriptionEntry {

    private Long id;
    private String title;
    private String url;
    private String feedTitle;
    private String tag;
    private String content;
    private String unseen;
    private Date createdAt;

    public SubscriptionEntry(UserEntryQuery userEntryQuery) {
        id = userEntryQuery.getId();
        title = userEntryQuery.getTitle();
        url = userEntryQuery.getUrl();
        feedTitle = userEntryQuery.getFeedTitle();
        tag = userEntryQuery.getTag();
        content = userEntryQuery.getContent();
        unseen = String.valueOf(userEntryQuery.isUnseen());
        createdAt = userEntryQuery.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getUnseen() {
        return unseen;
    }

    public void setUnseen(String unseen) {
        this.unseen = unseen;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

}
