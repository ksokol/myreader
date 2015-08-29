package myreader.entity;

import java.util.Date;
import java.util.Set;
import javax.persistence.Access;
import javax.persistence.AccessType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Version;

@Access(AccessType.PROPERTY)
@Entity
@Table(name = "feed")
public class Feed implements Identifiable {

    private Long id;
    private String title;
    private String url;
    private String lastModified;
    private Integer fetched = 0;
    private Date createdAt;
    private Set<Subscription> subscriptions;
    private Set<FeedEntry> entries;
    private long version;

    public Feed() {
        //TODO
        this.createdAt = new Date();
    }

    @Id
    @GeneratedValue
    @Column(name = "feed_id")
    @Override
    public Long getId() {
        return id;
    }

    @Override
    public void setId(Long id) {
        this.id = id;
    }

    @Column(columnDefinition = "VARCHAR(1000)", name = "feed_title", nullable = false)
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @Column(columnDefinition = "VARCHAR(1000)", name = "feed_url")
    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    @Column(name = "feed_last_modified")
    public String getLastModified() {
        return lastModified;
    }

    public void setLastModified(String lastModified) {
        this.lastModified = lastModified;
    }

    @Column(name = "feed_fetched")
    public Integer getFetched() {
        return fetched;
    }

    public void setFetched(Integer fetched) {
        this.fetched = fetched;
    }

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "feed_created_at")
    public Date getCreatedAt() {
        return new Date(createdAt.getTime());
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = new Date(createdAt.getTime());
    }

    @OneToMany(mappedBy = "feed")
    public Set<Subscription> getSubscriptions() {
        return subscriptions;
    }

    public void setSubscriptions(Set<Subscription> subscriptions) {
        this.subscriptions = subscriptions;
    }

    @OneToMany(mappedBy = "feed")
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

    @Column(columnDefinition = "INT DEFAULT 0", precision = 0)
    @Version
    public long getVersion() {
        return version;
    }

    public void setVersion(long version) {
        this.version = version;
    }
}
