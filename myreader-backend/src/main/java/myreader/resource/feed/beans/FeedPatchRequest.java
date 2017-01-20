package myreader.resource.feed.beans;

import myreader.resource.common.validation.ValidSyndication;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

/**
 * @author Kamill Sokol
 */
public class FeedPatchRequest {

    @NotNull(message = "may not be null")
    private String title;

    @ValidSyndication
    @Pattern(regexp="^https?://.*", message = "must begin with http(s)://")
    @NotNull(message = "may not be null")
    private String url;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
