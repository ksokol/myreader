package myreader.resource.feed.beans;

import myreader.resource.common.validation.ValidSyndication;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

/**
 * @author Kamill Sokol
 */
public class FeedProbeRequest {

    private String url;

    @ValidSyndication
    @Pattern(regexp="^https?://.*", message = "must begin with http(s)://")
    @NotNull(message = "may not be null")
    public String getUrl() {
        return url;
    }

    public void setUrl(final String url) {
        this.url = url;
    }
}
