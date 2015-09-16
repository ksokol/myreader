package myreader.resource.exclusionset.beans;

import spring.hateoas.UUIDResourceSupport;

/**
 * @author Kamill Sokol
 */
public class ExclusionSetGetResponse extends UUIDResourceSupport {

    private long patternCount;
    private long overallPatternHits;

    public long getPatternCount() {
        return patternCount;
    }

    public void setPatternCount(long patternCount) {
        this.patternCount = patternCount;
    }

    public long getOverallPatternHits() {
        return overallPatternHits;
    }

    public void setOverallPatternHits(long overallPatternHits) {
        this.overallPatternHits = overallPatternHits;
    }

    @Override
    public int hashCode() {
        return getUuid().hashCode();
    }

    @Override
    public boolean equals(final Object object) {
        if (this == object) {
            return true;
        }

        if (object == null || !object.getClass().equals(this.getClass())) {
            return false;
        }

        ExclusionSetGetResponse that = (ExclusionSetGetResponse) object;

        return this.getUuid().equals(that.getUuid());
    }
}
