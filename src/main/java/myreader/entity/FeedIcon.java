package myreader.entity;

import org.hibernate.annotations.Type;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class FeedIcon {

    @Column(name = "feed_icon_mimetype")
    private String mimeType;

    @Column(name = "feed_icon")
    @Type(type = "text")
    private String icon;

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

}
