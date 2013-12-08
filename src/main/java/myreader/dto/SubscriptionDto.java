package myreader.dto;

import java.util.Date;
import java.util.List;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;

public class SubscriptionDto {

    private Long id;
    private String title;
    private String url;
    private String tag;
    private int sum;
    private int unseen;

    private List<ExclusionPatternDto> exclusions;
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

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public int getSum() {
        return sum;
    }

    public void setSum(int sum) {
        this.sum = sum;
    }

    public int getUnseen() {
        return unseen;
    }

    public void setUnseen(int unseen) {
        this.unseen = unseen;
    }

    @XmlElementWrapper(name = "exclusions")
    @XmlElement(name = "exclusion")
    public List<ExclusionPatternDto> getExclusions() {
        return exclusions;
    }

    public void setExclusions(List<ExclusionPatternDto> exclusions) {
        this.exclusions = exclusions;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

}
