package myreader.resource.subscription.beans;

import java.util.Date;

public class FetchErrorGetResponse {

  private String uuid;
  private String message;
  private Date createdAt;

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

  public Date getCreatedAt() {
    return new Date(createdAt.getTime());
  }

  public void setCreatedAt(Date createdAt) {
    this.createdAt = new Date(createdAt.getTime());
  }
}
