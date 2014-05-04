package myreader.entity;

import javax.persistence.*;
import java.util.Date;
import java.util.Set;

@Entity
@Table(name = "user_feed")
public class Subscription {

    @Id
    @GeneratedValue
    @Column(name = "user_feed_id")
    private Long id;

    @Column(name = "user_feed_title")
    private String title;

    @Column(name = "user_feed_tag")
    private String tag;

    @JoinColumn(name = "user_feed_user_id")
    @ManyToOne(optional = false)
    private User user;

    @Column(name = "user_feed_sum")
    private int sum;

    @Column(name = "user_feed_unseen", columnDefinition = "INT DEFAULT 0", precision = 0)
    private int unseen = 0;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "user_feed_created_at")
    private Date createdAt;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_feed_feed_id", nullable = false, updatable = false)
    private Feed feed;

    @OneToMany(mappedBy = "subscription")
    private Set<SubscriptionEntry> subscriptionEntries;

    @OneToMany(cascade = CascadeType.ALL)
    private Set<ExclusionPattern> exclusions;

    public Subscription() {
        //TODO remove me
        this.createdAt = new Date();
    }

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

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Feed getFeed() {
        return feed;
    }

    public void setFeed(Feed feed) {
        this.feed = feed;
    }

    public Set<ExclusionPattern> getExclusions() {
        return exclusions;
    }

    public void setExclusions(Set<ExclusionPattern> exclusions) {
        this.exclusions = exclusions;
    }

    public Set<SubscriptionEntry> getSubscriptionEntries() {
        return subscriptionEntries;
    }

    public void setSubscriptionEntries(Set<SubscriptionEntry> subscriptionEntries) {
        this.subscriptionEntries = subscriptionEntries;
    }

}
