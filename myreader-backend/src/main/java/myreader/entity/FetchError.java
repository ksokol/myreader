package myreader.entity;

import javax.persistence.Access;
import javax.persistence.AccessType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.Date;

@Access(AccessType.PROPERTY)
@Entity
@Table(name = "fetch_error")
public class FetchError {

  private Long id;
  private Subscription subscription;
  private String message;
  private Date createdAt;

  /**
   * Default constructor for Hibernate.
   */
  public FetchError() {
  }

  public FetchError(Subscription subscription, String message) {
    this.subscription = subscription;
    this.message = message;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  public Subscription getSubscription() {
    return subscription;
  }

  public void setSubscription(Subscription subscription) {
    this.subscription = subscription;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
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
}
