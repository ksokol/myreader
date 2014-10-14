package myreader.resource.exclusionpattern.beans;

import org.springframework.hateoas.ResourceSupport;

import spring.hateoas.annotation.Rel;

/**
 * @author Kamill Sokol
 */
@Rel("pattern")
public class ExclusionPatternGetResponse extends ResourceSupport {

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
