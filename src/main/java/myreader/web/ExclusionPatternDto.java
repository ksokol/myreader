package myreader.web;

@Deprecated
public class ExclusionPatternDto {

    private String pattern;
    private int hitCount;

    public String getPattern() {
        return pattern;
    }

    public void setPattern(String pattern) {
        this.pattern = pattern;
    }

    public int getHitCount() {
        return hitCount;
    }

    public void setHitCount(int hitCount) {
        this.hitCount = hitCount;
    }

}
