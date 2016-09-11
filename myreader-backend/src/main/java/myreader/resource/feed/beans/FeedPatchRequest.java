package myreader.resource.feed.beans;

import myreader.resource.common.validation.ValidSyndication;
import myreader.resource.service.patch.PatchSupport;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

/**
 * @author Kamill Sokol
 */
public class FeedPatchRequest extends PatchSupport {

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
        this.addPatchedField("title");
        this.title = title;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.addPatchedField("url");
        this.url = url;
    }
}