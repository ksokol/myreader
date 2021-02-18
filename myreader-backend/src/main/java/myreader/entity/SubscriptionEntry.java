package myreader.entity;

import myreader.hibernate.SetArrayType;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;

import javax.persistence.Access;
import javax.persistence.AccessType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
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
  name = "subscription_entry",
  indexes = {
    @Index(name = "title_idx", columnList = "title"),
    @Index(name = "guid_idx", columnList = "guid"),
    @Index(name = "url_idx", columnList = "url")
  }
)
@TypeDef(
  name = "set-array",
  typeClass = SetArrayType.class
)
public class SubscriptionEntry {

  private Long id;
  private String title;
  private String guid;
  private String url;
  private String content;
  private boolean seen;
  private boolean excluded;
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

  public String getGuid() {
    return guid;
  }

  public void setGuid(String guid) {
    this.guid = guid;
  }

  public String getUrl() {
    return url;
  }

  public void setUrl(String url) {
    this.url = url;
  }

  public String getContent() {
    return content;
  }

  public void setContent(String content) {
    this.content = content;
  }

  public boolean isSeen() {
    return seen;
  }

  public void setSeen(boolean seen) {
    this.seen = seen;
  }

  public boolean isExcluded() {
    return excluded;
  }

  public void setExcluded(boolean excluded) {
    this.excluded = excluded;
  }

  @Type(type = "set-array")
  public Set<String> getTags() {
    return tags;
  }

  public void setTags(Set<String> tags) {
    this.tags = tags;
  }

  @ManyToOne(optional = false, fetch = FetchType.EAGER)
  public Subscription getSubscription() {
    return subscription;
  }

  public void setSubscription(Subscription subscription) {
    this.subscription = subscription;
  }

  @Temporal(TemporalType.TIMESTAMP)
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
