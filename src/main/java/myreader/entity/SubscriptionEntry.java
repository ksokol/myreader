package myreader.entity;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "user_feed_entry")
public class SubscriptionEntry {

    @Id
    @TableGenerator(name = "user_feed_entry_id_generator", table = "primary_keys")
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "user_feed_entry_id_generator")
    @Column(name = "user_feed_entry_id")
    private Long id;

    @Column(name = "user_feed_entry_is_read")
    private boolean seen;

    @Column(name = "user_feed_entry_tag")
    private String tag;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_feed_entry_user_feed_id")
    private Subscription subscription;

    @ManyToOne(optional = false,fetch = FetchType.LAZY)
    @JoinColumn(name = "user_feed_entry_entry_id")
    private FeedEntry feedEntry;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "user_feed_entry_created_at")
    private Date createdAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public boolean isSeen() {
        return seen;
    }

    public void setSeen(boolean seen) {
        this.seen = seen;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public Subscription getSubscription() {
        return subscription;
    }

    public void setSubscription(Subscription subscription) {
        this.subscription = subscription;
    }

    public FeedEntry getFeedEntry() {
        return feedEntry;
    }

    public void setFeedEntry(FeedEntry feedEntry) {
        this.feedEntry = feedEntry;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

}
