package myreader.entity;

import javax.persistence.Access;
import javax.persistence.AccessType;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Version;
import java.util.Date;
import java.util.Set;

@Access(AccessType.PROPERTY)
@Entity
@Table(name = "subscription")
public class Subscription {

  private Long id;
  private String title;
  private String url;
  private String tag;
  private String color;
  private Date createdAt;
  private int acceptedFetchCount;
  private String lastModified;
  private Integer overallFetchCount;
  private Integer resultSizePerFetch;
  private Set<SubscriptionEntry> subscriptionEntries;
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

  public int getAcceptedFetchCount() {
    return acceptedFetchCount;
  }

  public void setAcceptedFetchCount(int acceptedFetchCount) {
    this.acceptedFetchCount = acceptedFetchCount;
  }

  public String getLastModified() {
    return lastModified;
  }

  public void setLastModified(String lastModified) {
    this.lastModified = lastModified;
  }

  public Integer getOverallFetchCount() {
    return overallFetchCount;
  }

  public void setOverallFetchCount(Integer overallFetchCount) {
    this.overallFetchCount = overallFetchCount;
  }

  public Integer getResultSizePerFetch() {
    return resultSizePerFetch == null ? Integer.valueOf(1000) : resultSizePerFetch;
  }

  public void setResultSizePerFetch(Integer resultSizePerFetch) {
    this.resultSizePerFetch = resultSizePerFetch;
  }

  public String getTag() {
    return tag;
  }

  public void setTag(String tag) {
    this.tag = tag;
  }

  public String getColor() {
    return color;
  }

  public void setColor(String color) {
    this.color = color;
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

  @OneToMany(mappedBy = "subscription", cascade = CascadeType.REMOVE)
  public Set<SubscriptionEntry> getSubscriptionEntries() {
    return subscriptionEntries;
  }

  public void setSubscriptionEntries(Set<SubscriptionEntry> subscriptionEntries) {
    this.subscriptionEntries = subscriptionEntries;
  }

  @Version
  public long getVersion() {
    return version;
  }

  public void setVersion(long version) {
    this.version = version;
  }
}
