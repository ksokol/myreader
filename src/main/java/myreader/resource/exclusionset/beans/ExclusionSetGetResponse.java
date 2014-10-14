package myreader.resource.exclusionset.beans;

import org.springframework.hateoas.ResourceSupport;

import spring.hateoas.annotation.Rel;

/**
 * @author Kamill Sokol
 */
@Rel("exclusions")
public class ExclusionSetGetResponse extends ResourceSupport {

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
}
