package myreader.entity;

import java.util.Date;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.annotations.Formula;
import org.hibernate.search.annotations.Analyze;
import org.hibernate.search.annotations.ContainedIn;
import org.hibernate.search.annotations.Field;
import org.hibernate.search.annotations.IndexedEmbedded;

//@FilterDef(name = "user", parameters = { @ParamDef(name = "user", type = "string") })
//@Filter(name = "user", condition = "{u}.email = :user", aliases = @SqlFragmentAlias(alias = "u", entity = User.class))
@Entity
@Table(name = "user_feed")
public class Subscription {

    @Id
    @GeneratedValue
    @Column(name = "user_feed_id")
    private Long id;

    @Field(analyze = Analyze.NO)
    @Column(name = "user_feed_title")
    private String title;

    @Formula("(select f.feed_url from feed f where f.feed_id = user_feed_feed_id)")
    private String url;

    @Field(analyze = Analyze.NO)
    @Column(name = "user_feed_tag")
    private String tag;

    @IndexedEmbedded
    @JoinColumn(name = "user_feed_user_id")
    // @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @ManyToOne(optional = false)
    @Fetch(value = FetchMode.SELECT)
    private User user;

    @Column(name = "user_feed_sum")
    private int sum;

    @Formula("(select count(ufe.user_feed_entry_id) from user_feed_entry ufe where ufe.user_feed_entry_user_feed_id = user_feed_id and ufe.user_feed_entry_is_read = 0)")
    private int unseen;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "user_feed_created_at")
    private Date createdAt;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_feed_feed_id", nullable = false, updatable = false)
    @Fetch(value = FetchMode.SELECT)
    private Feed feed;

    @ContainedIn
    @OneToMany(mappedBy = "subscription")
    private Set<SubscriptionEntry> subscriptionEntries;

    @OneToMany(cascade = CascadeType.ALL)
    private Set<ExclusionPattern> exclusions;

    public Subscription() {
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

    // @Formula("select select count(ufe.user_feed_entry_id) from user_feed_entry ufe where ufe.user_feed_entry_user_feed_id = id and ufe.user_feed_entry_is_read = 0")
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
