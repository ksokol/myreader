package myreader.resource.feed.beans;

import myreader.resource.common.validation.ValidSyndication;
import org.hibernate.validator.constraints.NotBlank;

import javax.validation.constraints.Pattern;

/**
 * @author Kamill Sokol
 */
public class FeedPatchRequest {

    @NotBlank(message = "may not be empty")
    private String title;

    @ValidSyndication
    @Pattern(regexp="^https?://.*", message = "must begin with http(s)://")
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
