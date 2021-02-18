package myreader.entity;

import javax.persistence.Access;
import javax.persistence.AccessType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.Date;

@Access(AccessType.PROPERTY)
@Entity
@Table(name = "exclusion_pattern")
public class ExclusionPattern {

  private Long id;
  private String pattern;
  private int hitCount;
  private Subscription subscription;
  private Date createdAt;

  /**
   * Default constructor for Hibernate.
   */
  public ExclusionPattern() {
  }

  public ExclusionPattern(String pattern, Subscription subscription) {
    this.pattern = pattern;
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

  public String getPattern() {
    return pattern;
  }

  public void setPattern(String pattern) {
    this.pattern = pattern;
  }

  public int getHitCount() {
    return hitCount;
  }

  public void setHitCount(int hitCount) {
    this.hitCount = hitCount;
  }

  @Temporal(TemporalType.TIMESTAMP)
  public Date getCreatedAt() {
    return new Date(createdAt.getTime());
  }

  public void setCreatedAt(Date createdAt) {
    if (createdAt != null) {
      this.createdAt = new Date(createdAt.getTime());
    }
  }

  @ManyToOne(optional = false)
  public Subscription getSubscription() {
    return subscription;
  }

  public void setSubscription(Subscription subscription) {
    this.subscription = subscription;
  }

  @PrePersist
  public void onCreate() {
    if (this.createdAt == null) {
      this.createdAt = new Date();
    }
  }
}
