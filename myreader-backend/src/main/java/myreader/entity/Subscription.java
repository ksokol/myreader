package myreader.entity;

import org.hibernate.annotations.Formula;

import javax.persistence.Access;
import javax.persistence.AccessType;
import javax.persistence.CascadeType;
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
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Version;
import java.util.Date;
import java.util.Set;

@Access(AccessType.PROPERTY)
@Entity
@Table(name = "user_feed")
public class Subscription {

  private Long id;
  private String title;
  private int fetchCount;
  private int unseen;
  private Date createdAt;
  private Feed feed;
  private Long lastFeedEntryId;
  private Set<SubscriptionEntry> subscriptionEntries;
  private Set<ExclusionPattern> exclusions;
  private SubscriptionTag subscriptionTag;
  private long version;

  /**
   * Default constructor for Hibernate.
   */
  public Subscription() {
  }

  public Subscription(Feed feed) {
    this.feed = feed;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "user_feed_id")
  public Long getId() {
    return id;
  }

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

  @Column(name = "user_feed_sum")
  public int getFetchCount() {
    return fetchCount;
  }

  public void setFetchCount(int fetchCount) {
    this.fetchCount = fetchCount;
  }

  @Formula("(select count(ufe.user_feed_entry_id) from user_feed_entry ufe " +
    "where ufe.user_feed_entry_user_feed_id = user_feed_id and ufe.user_feed_entry_is_read = 0)")
  public int getUnseen() {
    return unseen;
  }

  public void setUnseen(int unseen) {
    this.unseen = unseen;
  }

  @Temporal(TemporalType.TIMESTAMP)
  @Column(name = "user_feed_created_at")
  public Date getCreatedAt() {
    if (createdAt != null) {
      return new Date(createdAt.getTime());
    }
    return new Date();
  }

  public void setCreatedAt(Date createdAt) {
    if (createdAt != null) {
      this.createdAt = new Date(createdAt.getTime());
    }
  }

  @ManyToOne(optional = false, fetch = FetchType.EAGER)
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

  @OneToMany(mappedBy = "subscription", cascade = CascadeType.REMOVE)
  public Set<SubscriptionEntry> getSubscriptionEntries() {
    return subscriptionEntries;
  }

  public void setSubscriptionEntries(Set<SubscriptionEntry> subscriptionEntries) {
    this.subscriptionEntries = subscriptionEntries;
  }

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "user_feed_user_feed_tag_id")
  public SubscriptionTag getSubscriptionTag() {
    return subscriptionTag;
  }

  public void setSubscriptionTag(SubscriptionTag subscriptionTag) {
    this.subscriptionTag = subscriptionTag;
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
