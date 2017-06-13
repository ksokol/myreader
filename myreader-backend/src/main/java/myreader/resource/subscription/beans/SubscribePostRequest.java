package myreader.resource.subscription.beans;

import myreader.resource.common.validation.ValidSyndication;
import myreader.resource.subscription.validation.UniqueSubscription;

import javax.validation.constraints.Pattern;

/**
 * @author Kamill Sokol
 */
public class SubscribePostRequest {

    private String origin;

    @ValidSyndication
    @UniqueSubscription
    @Pattern(regexp="^https?://.*", message = "must begin with http(s)://")
    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }
}
