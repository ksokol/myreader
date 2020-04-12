package myreader.resource.subscriptionentry.beans;

import java.time.Clock;
import java.time.Instant;
import java.util.Objects;

/**
 * @author Kamill Sokol
 */
public class SearchRequest {

    private final Clock clock;

    private String q;
    private String feedUuidEqual;
    private String seenEqual;
    private String feedTagEqual;
    private String entryTagEqual;
    private Long stamp;

    public SearchRequest(Clock clock) {
        this.clock = Objects.requireNonNull(clock, "clock is null");
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

    public Long getStamp() {
        return stamp != null ? stamp : Instant.now(clock).toEpochMilli();
    }

    public void setStamp(Long stamp) {
        this.stamp = stamp;
    }
}
