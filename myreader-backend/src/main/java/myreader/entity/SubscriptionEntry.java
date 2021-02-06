package myreader.entity;

import org.hibernate.search.annotations.Analyze;
import org.hibernate.search.annotations.DocumentId;
import org.hibernate.search.annotations.Field;
import org.hibernate.search.annotations.Indexed;
import org.hibernate.search.annotations.IndexedEmbedded;
import org.hibernate.search.annotations.NumericField;
import org.hibernate.search.annotations.SortableField;

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
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.Date;
import java.util.Set;

@Access(AccessType.PROPERTY)
@Indexed
@Entity
@Table(name = "user_feed_entry")
public class SubscriptionEntry {

  private Long id;
  private boolean seen;
  private Set<String> tags;
  private Subscription subscription;
  private FeedEntry feedEntry;
  private Date createdAt;

  /**
   * Default constructor for Hibernate.
   */
  public SubscriptionEntry() {
  }

  public SubscriptionEntry(Subscription subscription, FeedEntry feedEntry) {
    this.subscription = subscription;
    this.feedEntry = feedEntry;
  }

  @DocumentId
  @NumericField(precisionStep = 0)
  @SortableField
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "user_feed_entry_id")
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  @Field
  @Column(name = "user_feed_entry_is_read")
  public boolean isSeen() {
    return seen;
  }

  public void setSeen(boolean seen) {
    this.seen = seen;
  }

  @Field(analyze = Analyze.NO)
  @IndexedEmbedded
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

  @IndexedEmbedded
  @ManyToOne(optional = false, fetch = FetchType.EAGER)
  @JoinColumn(name = "user_feed_entry_user_feed_id")
  public Subscription getSubscription() {
    return subscription;
  }

  public void setSubscription(Subscription subscription) {
    this.subscription = subscription;
  }

  @ManyToOne(optional = false, fetch = FetchType.EAGER)
  @JoinColumn(name = "user_feed_entry_entry_id")
  public FeedEntry getFeedEntry() {
    return feedEntry;
  }

  public void setFeedEntry(FeedEntry feedEntry) {
    this.feedEntry = feedEntry;
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
}
