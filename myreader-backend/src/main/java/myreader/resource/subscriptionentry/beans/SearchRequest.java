package myreader.resource.subscriptionentry.beans;

/**
 * @author Kamill Sokol
 */
public class SearchRequest {

    private static final int DEFAULT_PAGE_SIZE = 20;

    private String q;
    private String feedUuidEqual;
    private String seenEqual;
    private String feedTagEqual;
    private String entryTagEqual;
    private String size;
    private String next;

    public int getSize() {
        return size == null ? DEFAULT_PAGE_SIZE : Integer.parseInt(size);
    }

    public void setSize(String size) {
        this.size = size;
    }

    public Long getNext() {
        return next == null ? Long.valueOf(Long.MAX_VALUE) : Long.valueOf(next);
    }

    public void setNext(String next) {
        this.next = next;
    }

    public String getQ() {
        return q;
    }

    public void setQ(String q) {
        this.q = q;
    }

    public String getFeedUuidEqual() {
        return feedUuidEqual;
    }

    public void setFeedUuidEqual(String feedUuidEqual) {
        this.feedUuidEqual = feedUuidEqual;
    }

    public String getSeenEqual() {
        return seenEqual;
    }

    public void setSeenEqual(String seenEqual) {
        this.seenEqual = seenEqual;
    }

    public String getFeedTagEqual() {
        return feedTagEqual;
    }

    public void setFeedTagEqual(String feedTagEqual) {
        this.feedTagEqual = feedTagEqual;
    }

    public String getEntryTagEqual() {
        return entryTagEqual;
    }

    public void setEntryTagEqual(String entryTagEqual) {
        this.entryTagEqual = entryTagEqual;
    }
}
