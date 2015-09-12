package myreader.resource.exclusionpattern.beans;

import myreader.resource.exclusionpattern.validation.ValidRegexp;

/**
 * @author Kamill Sokol
 */
public class ExclusionPatternPostRequest {

    @ValidRegexp
    private String pattern;

    public String getPattern() {
        return pattern;
    }

    public void setPattern(String pattern) {
        this.pattern = pattern;
    }
}
