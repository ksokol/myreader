package myreader.resource.subscription.beans;

import java.time.OffsetDateTime;

public class SubscriptionGetResponse {

  private String uuid;
  private String title;
  private String tag;
  private String color;
  private int sum;
  private long unseen;
  private String origin;
  private long fetchErrorCount;
  private OffsetDateTime createdAt;

  public String getUuid() {
    return uuid;
  }

  public void setUuid(String uuid) {
    this.uuid = uuid;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
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

  public int getSum() {
    return sum;
  }

  public void setSum(int sum) {
    this.sum = sum;
  }

  public long getUnseen() {
    return unseen;
  }

  public void setUnseen(long unseen) {
    this.unseen = unseen;
  }

  public OffsetDateTime getCreatedAt() {
    return createdAt;
  }

  public String getOrigin() {
    return origin;
  }

  public void setOrigin(final String origin) {
    this.origin = origin;
  }

  public long getFetchErrorCount() {
    return fetchErrorCount;
  }

  public void setFetchErrorCount(long fetchErrorCount) {
    this.fetchErrorCount = fetchErrorCount;
  }

  public void setCreatedAt(OffsetDateTime createdAt) {
    this.createdAt = createdAt;
  }
}
