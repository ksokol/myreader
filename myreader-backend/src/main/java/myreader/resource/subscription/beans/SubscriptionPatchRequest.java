package myreader.resource.subscription.beans;

public class SubscriptionPatchRequest {

  private String title;
  private String origin;
  private String tag;
  private String color;

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
  }
