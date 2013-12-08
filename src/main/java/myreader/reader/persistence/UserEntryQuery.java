package myreader.reader.persistence;

import java.util.Date;

public class UserEntryQuery {

    private Long id;
    private String title;
    private String url;
    private String feedTitle;
    private String tag;
    private String content;
    private boolean unseen;
    private IconDto icon;
    private Date createdAt;

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

    public boolean isUnseen() {
        return unseen;
    }

    public void setUnseen(boolean unseen) {
        this.unseen = unseen;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public IconDto getIcon() {
        return icon;
    }

    public void setIcon(IconDto icon) {
        this.icon = icon;
    }

    public static class IconDto {
        private String mimeType;
        private String base64;

        public IconDto(String mimetype, String icon) {
            this.mimeType = mimetype;
            this.base64 = icon;
        }

        public String getMimeType() {
            return mimeType;
        }

        public void setMimeType(String mimeType) {
            this.mimeType = mimeType;
        }

        public String getBase64() {
            return base64;
        }

        public void setBase64(String icon) {
            this.base64 = icon;
        }
    }
}
