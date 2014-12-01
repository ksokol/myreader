package myreader.entity;

import java.util.Date;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Version;

@Entity
@Table(name = "feed")
public class Feed implements Identifiable {

    @Id
    @GeneratedValue
    @Column(name = "feed_id")
    private Long id;

    @Column(name = "feed_title", nullable = false)
    private String title;

    @Column(name = "feed_url")
    private String url;

    @Column(name = "feed_last_modified")
    private String lastModified;

    @Column(name = "feed_fetched")
    private Integer fetched = 0;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "feed_created_at")
    private Date createdAt;

    @OneToMany(mappedBy = "feed")
    private Set<Subscription> subscriptions;

    @Embedded
    private FeedIcon icon;

    @OneToMany(mappedBy = "feed")
    private Set<FeedEntry> entries;

    @Column(columnDefinition = "INT DEFAULT 0", precision = 0)
    @Version
    private long version;

    public Feed() {
        //TODO
        this.createdAt = new Date();
    }

    @Override
    public Long getId() {
        return id;
    }

    @Override
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

    public String getLastModified() {
        return lastModified;
    }

    public void setLastModified(String lastModified) {
        this.lastModified = lastModified;
    }

    public Integer getFetched() {
        return fetched;
    }

    public void setFetched(Integer fetched) {
        this.fetched = fetched;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Set<Subscription> getSubscriptions() {
        return subscriptions;
    }

    public void setSubscriptions(Set<Subscription> subscriptions) {
        this.subscriptions = subscriptions;
    }

    public FeedIcon getIcon() {
        return icon;
    }

    public void setIcon(FeedIcon icon) {
        this.icon = icon;
    }

    public Set<FeedEntry> getEntries() {
        return entries;
    }

    public void setEntries(Set<FeedEntry> entries) {
        this.entries = entries;
    }

    // TODO
    @PrePersist
    public void onCreate() {
        this.createdAt = new Date();
    }

    public long getVersion() {
        return version;
    }

    public void setVersion(long version) {
        this.version = version;
    }
}
