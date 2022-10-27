package myreader.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.OffsetDateTime;
import java.util.Objects;

@Table("SUBSCRIPTION_ENTRY")
public class SubscriptionEntry {

  private Long id;
  private final String title;
  private final String guid;
  private final String url;
  private final String content;
  private boolean seen;
  private final boolean excluded;
  private final Long subscriptionId;
  private final OffsetDateTime createdAt;

  public SubscriptionEntry(
    String title,
    String guid,
    String url,
    String content,
    boolean seen,
    boolean excluded,
    Long subscriptionId,
    OffsetDateTime createdAt
  ) {
    this.title = title;
    this.guid = guid;
    this.url = Objects.requireNonNull(url, "url is null");
    this.content = content;
    this.seen = seen;
    this.excluded = excluded;
    this.subscriptionId = Objects.requireNonNull(subscriptionId, "subscriptionId is null");
    this.createdAt = Objects.requireNonNull(createdAt, "createdAt is null");
  }

  @Id
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getTitle() {
    return title;
  }

  public String getGuid() {
    return guid;
  }

  public String getUrl() {
    return url;
  }

  public String getContent() {
    return content;
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

  public Long getSubscriptionId() {
    return subscriptionId;
  }

  public OffsetDateTime getCreatedAt() {
    return createdAt;
  }
}
