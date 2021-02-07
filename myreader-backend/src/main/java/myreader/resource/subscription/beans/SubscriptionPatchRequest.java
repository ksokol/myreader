package myreader.resource.subscription.beans;

public class SubscriptionPatchRequest {

  private String title;
  private String origin;
  private FeedTag feedTag;

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getOrigin() {
    return origin;
  }

  public void setOrigin(String origin) {
    this.origin = origin;
  }

  public FeedTag getFeedTag() {
    return feedTag;
  }

  public void setFeedTag(FeedTag feedTag) {
    this.feedTag = feedTag;
  }

  public static class FeedTag {

    private String name;
    private String color;

    public FeedTag() {
      // required by Jackson
    }

    public String getName() {
      return name;
    }

    public void setName(String name) {
      this.name = name;
    }

    public String getColor() {
      return color;
    }

    public void setColor(String color) {
      this.color = color;
    }
  }
}
