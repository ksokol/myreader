package myreader.resource.exclusionset.beans;

import org.springframework.hateoas.ResourceSupport;

/**
 * @author Kamill Sokol
 */
@SuppressWarnings("PMD.UselessOverridingMethod")
public class ExclusionSetGetResponse extends ResourceSupport {

    private String uuid;
    private long patternCount;
    private long overallPatternHits;

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

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
    public boolean equals(Object o) {
        return super.equals(o);
    }

    @Override
    public int hashCode() {
        return super.hashCode();
    }
}
