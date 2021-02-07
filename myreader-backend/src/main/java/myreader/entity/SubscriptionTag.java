package myreader.entity;

import javax.persistence.Access;
import javax.persistence.AccessType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.Date;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Access(AccessType.PROPERTY)
@Entity
@Table(name = "user_feed_tag")
public class SubscriptionTag {

  private Long id;
  private String name;
  private String color;
  private Set<Subscription> subscriptions;
  private Date createdAt;

  /**
   * Default constructor for Hibernate.
   */
  public SubscriptionTag() {
  }

  public SubscriptionTag(String name) {
    this.name = Objects.requireNonNull(name, "name is null");
  }

  public SubscriptionTag(String name, Subscription subscription) {
    this.name = Objects.requireNonNull(name, "name is null");
    Objects.requireNonNull(name, "subscription is null");
    subscriptions = new HashSet<>();
    subscriptions.add(subscription);
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "user_feed_tag_id")
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  @Column(name = "user_feed_tag_name", nullable = false)
  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  @Column(name = "user_feed_tag_color")
  public String getColor() {
    return color;
  }

  public void setColor(String color) {
    this.color = color;
  }

  @OneToMany(mappedBy = "subscriptionTag")
  public Set<Subscription> getSubscriptions() {
    return subscriptions;
  }

  public void setSubscriptions(Set<Subscription> subscriptions) {
    this.subscriptions = subscriptions;
  }

  @Temporal(TemporalType.TIMESTAMP)
  @Column(name = "user_feed_tag_created_at")
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

  @Override
  public boolean equals(Object other) {
    if (this == other) {
      return true;
    }
    if (other == null || getClass() != other.getClass()) {
      return false;
    }
    SubscriptionTag that = (SubscriptionTag) other;
    return Objects.equals(id, that.id);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id);
  }
}
