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
  private String url;
  private int unseen;
  private Date createdAt;
  private Long lastFeedEntryId;
  private int fetchCount;
  private String lastModified;
  private Integer fetched = 0;
  private Integer resultSizePerFetch;
  private Set<SubscriptionEntry> subscriptionEntries;
  private Set<FeedEntry> entries;
  private Set<ExclusionPattern> exclusions;
  private SubscriptionTag subscriptionTag;
  private long fetchErrorCount;
  private Set<FetchError> fetchErrors;
  private long version;

  /**
   * Default constructor for Hibernate.
   */
  public Subscription() {
  }

  public Subscription(String url, String title) {
    this.url = url;
    this.title = title;
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

  @Column(columnDefinition = "VARCHAR(1000)", name = "url")
  public String getUrl() {
    return url;
  }

  public void setUrl(String url) {
    this.url = url;
  }

  @Column(name = "user_feed_sum")
  public int getFetchCount() {
    return fetchCount;
  }

  public void setFetchCount(int fetchCount) {
    this.fetchCount = fetchCount;
  }

  @Column(name = "last_modified", columnDefinition = "VARCHAR(255)")
  public String getLastModified() {
    return lastModified;
  }

  public void setLastModified(String lastModified) {
    this.lastModified = lastModified;
  }

  @Column(name = "fetched")
  public Integer getFetched() {
    return fetched;
  }

  public void setFetched(Integer fetched) {
    this.fetched = fetched;
  }

  @Column(name = "result_size_per_fetch")
  public Integer getResultSizePerFetch() {
    return resultSizePerFetch == null ? Integer.valueOf(1000) : resultSizePerFetch;
  }

  public void setResultSizePerFetch(Integer resultSizePerFetch) {
    this.resultSizePerFetch = resultSizePerFetch;
  }

  @Formula(
    "(select count(ufe.user_feed_entry_id) from user_feed_entry ufe " +
    "where ufe.user_feed_entry_user_feed_id = user_feed_id and ufe.user_feed_entry_is_read = 0)"
  )
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

  @OneToMany(mappedBy = "subscription", cascade = CascadeType.REMOVE)
  public Set<FeedEntry> getEntries() {
    return entries;
  }

  public void setEntries(Set<FeedEntry> entries) {
    this.entries = entries;
  }

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "user_feed_user_feed_tag_id")
  public SubscriptionTag getSubscriptionTag() {
    return subscriptionTag;
  }

  public void setSubscriptionTag(SubscriptionTag subscriptionTag) {
    this.subscriptionTag = subscriptionTag;
  }

  @Formula(
    "(select count(fe.fetch_error_id) from fetch_error fe where fe.fetch_error_subscription_id = user_feed_id)"
  )
  public long getFetchErrorCount() {
    return fetchErrorCount;
  }

  public void setFetchErrorCount(long fetchErrorCount) {
    this.fetchErrorCount = fetchErrorCount;
  }

  @OneToMany(mappedBy = "subscription", cascade = CascadeType.REMOVE)
  public Set<FetchError> getFetchErrors() {
    return fetchErrors;
  }

  public void setFetchErrors(Set<FetchError> fetchErrors) {
    this.fetchErrors = fetchErrors;
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
