package myreader.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.OffsetDateTime;
import java.util.Objects;

@Table("SUBSCRIPTION")
public class Subscription {

  private Long id;
  private String title;
  private String url;
  private String tag;
  private String color;
  private int acceptedFetchCount;
  private String lastModified;
  private int overallFetchCount;
  private Integer resultSizePerFetch;
  private final OffsetDateTime createdAt;

  public Subscription(
    String url,
    String title,
    String tag,
    String color,
    int acceptedFetchCount,
    String lastModified,
    Integer overallFetchCount,
    Integer resultSizePerFetch,
    OffsetDateTime createdAt
  ) {
    this.url = Objects.requireNonNull(url, "url is null");
    this.title = title;
    this.tag = tag;
    this.color = color;
    this.acceptedFetchCount = acceptedFetchCount;
    this.lastModified = lastModified;
    this.overallFetchCount = Objects.requireNonNull(overallFetchCount, "overallFetchCount is null");
    this.resultSizePerFetch = resultSizePerFetch;
    this.createdAt = Objects.requireNonNull(createdAt, " is null");
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

  public OffsetDateTime getCreatedAt() {
      return createdAt;
  }
}
