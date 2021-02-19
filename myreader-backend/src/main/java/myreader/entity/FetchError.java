package myreader.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.OffsetDateTime;
import java.util.Objects;

@Table("FETCH_ERROR")
public class FetchError {

  private Long id;
  private final Long subscriptionId;
  private final String message;
  private final OffsetDateTime createdAt;

  public FetchError(Long subscriptionId, String message, OffsetDateTime createdAt) {
    this.subscriptionId = Objects.requireNonNull(subscriptionId, "subscriptionId is null");
    this.message = message;
    this.createdAt = Objects.requireNonNull(createdAt, "createdAt is null");
  }

  @Id
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getSubscriptionId() {
    return subscriptionId;
  }

  public String getMessage() {
    return message;
  }

  public OffsetDateTime getCreatedAt() {
    return createdAt;
  }
}
