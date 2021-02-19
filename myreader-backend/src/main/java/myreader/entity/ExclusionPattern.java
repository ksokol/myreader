package myreader.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.OffsetDateTime;
import java.util.Objects;

@Table("EXCLUSION_PATTERN")
public class ExclusionPattern {

  private Long id;
  private final String pattern;
  private final Integer hitCount;
  private final Long subscriptionId;
  private final OffsetDateTime createdAt;

  public ExclusionPattern(String pattern, Long subscriptionId, Integer hitCount, OffsetDateTime createdAt) {
    this.pattern = Objects.requireNonNull(pattern, "pattern is null");
    this.subscriptionId = Objects.requireNonNull(subscriptionId, "subscriptionId is null");
    this.hitCount = Objects.requireNonNull(hitCount, "hitCount is null");
    this.createdAt = Objects.requireNonNull(createdAt, "createdAt is null");
  }

  @Id
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getPattern() {
    return pattern;
  }

  public Integer getHitCount() {
    return hitCount;
  }

  public OffsetDateTime getCreatedAt() {
    return createdAt;
  }

  public Long getSubscriptionId() {
    return subscriptionId;
  }
}
