package myreader.resource.subscription.beans;

import myreader.resource.subscription.validation.UniqueSubscription;
import myreader.resource.common.validation.ValidSyndication;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

/**
 * @author Kamill Sokol
 */
public class SubscribePostRequest {

    @ValidSyndication
    @UniqueSubscription
    @Pattern(regexp="^https?://.*", message = "must begin with http(s)://")
    @NotNull(message = "may not be null")
    private String origin;

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }
}