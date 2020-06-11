package myreader.resource.subscription.beans;

/**
 * @author Kamill Sokol
 */
public class SubscriptionPatchRequest {

    private String title;
    private FeedTag feedTag;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
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

        public FeedTag() {}

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
