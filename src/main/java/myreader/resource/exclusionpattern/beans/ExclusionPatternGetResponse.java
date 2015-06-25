package myreader.resource.exclusionpattern.beans;

import spring.hateoas.UUIDResourceSupport;

/**
 * @author Kamill Sokol
 */
public class ExclusionPatternGetResponse extends UUIDResourceSupport {

    private long hitCount;
    private String pattern;

    public long getHitCount() {
        return hitCount;
    }

    public void setHitCount(long hitCount) {
        this.hitCount = hitCount;
    }

    public String getPattern() {
        return pattern;
    }

    public void setPattern(String pattern) {
        this.pattern = pattern;
    }
}
