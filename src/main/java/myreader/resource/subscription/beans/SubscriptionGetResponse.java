package myreader.resource.subscription.beans;

import org.springframework.hateoas.Link;
import org.springframework.hateoas.ResourceSupport;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
public class SubscriptionGetResponse extends ResourceSupport {
    private Long id;
    private String title;
    private String url;
    private String tag;
    private int sum;
    private long unseen;
    private Date createdAt;

    private List<Link> links = new ArrayList<Link>(3);

//    public Long getId() {
//        return id;
//    }

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

    public long getUnseen() {
        return unseen;
    }

    public void setUnseen(long unseen) {
        this.unseen = unseen;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public List<Link> getLinks() {
        return links;
    }

}
