package myreader.resource.subscription.beans;

import java.time.OffsetDateTime;

public class FetchErrorGetResponse {

  private String uuid;
  private String message;
  private OffsetDateTime createdAt;

  public String getUuid() {
    return uuid;
  }

  public void setUuid(String uuid) {
    this.uuid = uuid;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public OffsetDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(OffsetDateTime createdAt) {
    this.createdAt = createdAt;
  }
}
