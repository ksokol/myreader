package myreader.resource.subscriptionentry.beans;

public class SearchRequest {

  private String feedUuidEqual;
  private Boolean seenEqual;
  private String feedTagEqual;
  private Long uuid;

  public String getFeedUuidEqual() {
    return feedUuidEqual;
  }

  public void setFeedUuidEqual(String feedUuidEqual) {
    this.feedUuidEqual = feedUuidEqual;
  }

  public Boolean getSeenEqual() {
    return seenEqual;
  }

  public void setSeenEqual(Boolean seenEqual) {
    this.seenEqual = seenEqual;
  }

  public String getFeedTagEqual() {
    return feedTagEqual;
  }

  public void setFeedTagEqual(String feedTagEqual) {
    this.feedTagEqual = feedTagEqual;
  }


  public Long getUuid() {
    return uuid;
  }

  public void setUuid(Long uuid) {
    this.uuid = uuid;
  }
}
