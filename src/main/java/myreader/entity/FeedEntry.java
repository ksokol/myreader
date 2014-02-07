package myreader.entity;

import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.TableGenerator;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.Type;

@Entity
@Table(name = "entry")
public class FeedEntry {

    @Id
    @TableGenerator(name = "feed_entry_id_generator", table = "primary_keys")
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "feed_entry_id_generator")
    @Column(name = "entry_id")
    private Long id;

    @JoinColumn(name = "entry_feed_id")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Feed feed;

    //@Field
    @Column(name = "entry_title")
    private String title;

    @Column(name = "entry_guid")
    private String guid;

    @Column(name = "entry_url")
    private String url;

    // @Field
    @Column(name = "entry_content")
    @Type(type="text")
    private String content;

    // @ContainedIn
    @OneToMany(mappedBy = "feedEntry")
    private List<SubscriptionEntry> subscriptionEntries;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "entry_created_at")
    private Date createdAt;

    public FeedEntry() {
        this.createdAt = new Date();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Feed getFeed() {
        return feed;
    }

    public void setFeed(Feed feed) {
        this.feed = feed;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getGuid() {
        return guid;
    }

    public void setGuid(String guid) {
        this.guid = guid;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public List<SubscriptionEntry> getSubscriptionEntries() {
        return subscriptionEntries;
    }

    public void setSubscriptionEntries(List<SubscriptionEntry> subscriptionEntries) {
        this.subscriptionEntries = subscriptionEntries;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}
