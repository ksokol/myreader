package myreader.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.OffsetDateTime;

@Table("SUBSCRIPTION_VIEW")
public class SubscriptionView {

  private Long id;
  private String title;
  private String url;
  private String tag;
  private String color;
  private int acceptedFetchCount;
  private String lastModified;
  private int overallFetchCount;
  private Integer resultSizePerFetch;
  private long unseen;
  private long fetchErrorCount;
  private OffsetDateTime createdAt;

  @Id
  public Long getId() {
    return id;
  }

  public String getTitle() {
    return title;
  }

  public String getUrl() {
    return url;
  }

  public int getAcceptedFetchCount() {
    return acceptedFetchCount;
  }

  public String getLastModified() {
    return lastModified;
  }

  public Integer getOverallFetchCount() {
    return overallFetchCount;
  }

  public Integer getResultSizePerFetch() {
    return resultSizePerFetch;
  }

  public String getTag() {
    return tag;
  }

  public String getColor() {
    return color;
  }

  public long getUnseen() {
    return unseen;
  }

  public long getFetchErrorCount() {
    return fetchErrorCount;
  }

  public OffsetDateTime getCreatedAt() {
    return createdAt;
  }
}
