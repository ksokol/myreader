package myreader.entity;

import org.hibernate.search.annotations.Boost;
import org.hibernate.search.annotations.ContainedIn;
import org.hibernate.search.annotations.Field;

import javax.persistence.Access;
import javax.persistence.AccessType;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.Date;
import java.util.List;

@Access(AccessType.PROPERTY)
@Entity
@Table(name = "entry",
        indexes = {
                @Index(name = "entry_title_idx", columnList = "entry_title"),
                @Index(name = "entry_guid_idx", columnList = "entry_guid"),
                @Index(name = "entry_url_idx", columnList = "entry_url")
        }
)
public class FeedEntry {

    private Long id;
    private Feed feed;
    private String title;
    private String guid;
    private String url;
    private String content;
    private List<SubscriptionEntry> subscriptionEntries;
    private Date createdAt;

    /**
     * @deprecated Use {@link #FeedEntry(Feed)} instead.
     */
    @Deprecated
    public FeedEntry() {}

    public FeedEntry(Feed feed) {
        this.feed = feed;
    }

    @Id
    @GeneratedValue
    @Column(name = "entry_id")
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @JoinColumn(name = "entry_feed_id")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    public Feed getFeed() {
        return feed;
    }

    public void setFeed(Feed feed) {
        this.feed = feed;
    }

    @Field(boost = @Boost(value = 0.5F))
    @Column(columnDefinition = "VARCHAR(1000)", name = "entry_title")
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @Column(columnDefinition = "VARCHAR(1000)", name = "entry_guid")
    public String getGuid() {
        return guid;
    }

    public void setGuid(String guid) {
        this.guid = guid;
    }

    @Column(columnDefinition = "VARCHAR(1000)", name = "entry_url")
    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    @Field
    @Column(columnDefinition = "LONGVARCHAR", name = "entry_content")
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @ContainedIn
    @OneToMany(mappedBy = "feedEntry", cascade = CascadeType.REMOVE)
    public List<SubscriptionEntry> getSubscriptionEntries() {
        return subscriptionEntries;
    }

    public void setSubscriptionEntries(List<SubscriptionEntry> subscriptionEntries) {
        this.subscriptionEntries = subscriptionEntries;
    }

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "entry_created_at")
    public Date getCreatedAt() {
        if(createdAt != null) {
            return new Date(createdAt.getTime());
        }
        return new Date();
    }

    public void setCreatedAt(Date createdAt) {
        if(createdAt != null) {
            this.createdAt = new Date(createdAt.getTime());
        }
    }

    @PrePersist
    private void onCreate() {
        if(this.createdAt == null) {
            this.createdAt = new Date();
        }
    }
}
