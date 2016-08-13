package myreader.entity;

import org.hibernate.search.annotations.Analyze;
import org.hibernate.search.annotations.ContainedIn;
import org.hibernate.search.annotations.Field;
import org.hibernate.search.annotations.FieldBridge;
import org.hibernate.search.annotations.Index;
import org.hibernate.search.annotations.IndexedEmbedded;
import org.hibernate.search.bridge.builtin.LongBridge;

import java.util.Date;
import java.util.Set;
import javax.persistence.Access;
import javax.persistence.AccessType;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Version;

@Access(AccessType.PROPERTY)
@Entity
@Table(name = "user_feed")
public class Subscription implements Identifiable {

    private Long id;
    private String title;
    private String tag;
    private User user;
    private int fetchCount;
    private int unseen = 0;
    private Date createdAt;
    private Feed feed;
    private Long lastFeedEntryId;
    private Set<SubscriptionEntry> subscriptionEntries;
    private Set<ExclusionPattern> exclusions;
    private long version;

    @FieldBridge(impl = LongBridge.class)
    @Field(name = "subscriptionId", index = Index.YES)
    @Id
    @GeneratedValue
    @Column(name = "user_feed_id")
    @Override
    public Long getId() {
        return id;
    }

    @Override
    public void setId(Long id) {
        this.id = id;
    }

    @Column(name = "user_feed_title")
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @Field(analyze = Analyze.NO)
    @Column(name = "user_feed_tag")
    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    @Column(name = "user_feed_sum")
    public int getFetchCount() {
        return fetchCount;
    }

    public void setFetchCount(int fetchCount) {
        this.fetchCount = fetchCount;
    }

    @Column(name = "user_feed_unseen", columnDefinition = "INT DEFAULT 0", precision = 0)
    public int getUnseen() {
        return unseen;
    }

    public void setUnseen(int unseen) {
        this.unseen = unseen;
    }

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "user_feed_created_at")
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

    @IndexedEmbedded
    @JoinColumn(name = "user_feed_user_id")
    @ManyToOne(optional = false)
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_feed_feed_id", nullable = false, updatable = false)
    public Feed getFeed() {
        return feed;
    }

    public void setFeed(Feed feed) {
        this.feed = feed;
    }

    @Column(name = "last_feed_entry")
    public Long getLastFeedEntryId() {
        return lastFeedEntryId;
    }

    public void setLastFeedEntryId(Long lastFeedEntryId) {
        this.lastFeedEntryId = lastFeedEntryId;
    }

    @OneToMany(mappedBy = "subscription", cascade = CascadeType.REMOVE)
    public Set<ExclusionPattern> getExclusions() {
        return exclusions;
    }

    public void setExclusions(Set<ExclusionPattern> exclusions) {
        this.exclusions = exclusions;
    }

    @ContainedIn
    @OneToMany(mappedBy = "subscription", cascade = CascadeType.REMOVE)
    public Set<SubscriptionEntry> getSubscriptionEntries() {
        return subscriptionEntries;
    }

    public void setSubscriptionEntries(Set<SubscriptionEntry> subscriptionEntries) {
        this.subscriptionEntries = subscriptionEntries;
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
