package myreader.entity;

/**
 * @author Kamill Sokol
 */
public class ExclusionSet {

    private final long patternCount;
    private final long overallPatternHitCount;
    private final Long subscriptionId;

    public ExclusionSet(long patternCount, long overallPatternHitCount, Long subscriptionId) {
        this.patternCount = patternCount;
        this.overallPatternHitCount = overallPatternHitCount;
        this.subscriptionId = subscriptionId;
    }

    public long getPatternCount() {
        return patternCount;
    }

    public long getOverallPatternHitCount() {
        return overallPatternHitCount;
    }

    public Long getSubscriptionId() {
        return subscriptionId;
    }
}
