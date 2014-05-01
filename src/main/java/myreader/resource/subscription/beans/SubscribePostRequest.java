package myreader.resource.subscription.beans;

import myreader.resource.subscription.validation.UniqueSubscription;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

/**
 * @author Kamill Sokol
 */
public class SubscribePostRequest {

    @UniqueSubscription
    @Pattern(regexp="^https?://.*", message = "must begin with http(s)://")
    @NotNull(message = "may not be null")
    private String url;

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
