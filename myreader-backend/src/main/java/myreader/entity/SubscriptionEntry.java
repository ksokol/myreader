package myreader.entity;

import javax.persistence.Access;
import javax.persistence.AccessType;
import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.Date;
import java.util.Set;

@Access(AccessType.PROPERTY)
@Entity
@Table(
  name = "user_feed_entry",
  indexes = {
    @Index(name = "title_idx", columnList = "title"),
    @Index(name = "guid_idx", columnList = "guid"),
    @Index(name = "url_idx", columnList = "url")
  }
)
public class SubscriptionEntry {

  private Long id;
  private String title;
  private String guid;
  private String url;
  private String content;
  private boolean seen;
  private Set<String> tags;
  private Subscription subscription;
  private Date createdAt;

  /**
   * Default constructor for Hibernate.
   */
  public SubscriptionEntry() {
  }

  public SubscriptionEntry(Subscription subscription) {
    this.subscription = subscription;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "user_feed_entry_id")
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  @Column(columnDefinition = "VARCHAR(1000)", name = "title")
  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  @Column(columnDefinition = "VARCHAR(1000)", name = "guid")
  public String getGuid() {
    return guid;
  }

  public void setGuid(String guid) {
    this.guid = guid;
  }

  @Column(columnDefinition = "VARCHAR(1000)", name = "url")
  public String getUrl() {
    return url;
  }

  public void setUrl(String url) {
    this.url = url;
  }

  @Column(columnDefinition = "LONGVARCHAR", name = "content")
  public String getContent() {
    return content;
  }

  public void setContent(String content) {
    this.content = content;
  }

  @Column(name = "user_feed_entry_is_read")
  public boolean isSeen() {
    return seen;
  }

  public void setSeen(boolean seen) {
    this.seen = seen;
  }

  @Column(columnDefinition = "VARCHAR(32)", name = "tag")
  @ElementCollection(fetch = FetchType.EAGER)
  @CollectionTable(
    name = "user_feed_entry_tags",
    joinColumns = @JoinColumn(name = "user_feed_entry_id", referencedColumnName = "user_feed_entry_id")
  )
  public Set<String> getTags() {
    return tags;
  }

  public void setTags(Set<String> tags) {
    this.tags = tags;
  }

  @ManyToOne(optional = false, fetch = FetchType.EAGER)
  @JoinColumn(name = "user_feed_entry_user_feed_id")
  public Subscription getSubscription() {
    return subscription;
  }

  public void setSubscription(Subscription subscription) {
    this.subscription = subscription;
  }

  @Temporal(TemporalType.TIMESTAMP)
  @Column(name = "user_feed_entry_created_at")
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

  @PrePersist
  private void onCreate() {
    if (this.createdAt == null) {
      this.createdAt = new Date();
    }
  }
}
