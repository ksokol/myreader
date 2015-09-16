package myreader.resource.exclusionpattern.beans;

import spring.hateoas.UUIDResourceSupport;

/**
 * @author Kamill Sokol
 */
public class ExclusionPatternGetResponse extends UUIDResourceSupport {

    private long hitCount;
    private String pattern;
    private String uuid;

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

    @Override
    public boolean equals(final Object object) {
        if (this == object) {
            return true;
        }
        if (object == null || getClass() != object.getClass()) {
            return false;
        }
        if (!super.equals(object)) {
            return false;
        }

        final ExclusionPatternGetResponse that = (ExclusionPatternGetResponse) object;

        return uuid.equals(that.uuid);

    }

    @Override
    public int hashCode() {
        int result = super.hashCode();
        result = 31 * result + uuid.hashCode();
        return result;
    }
}
