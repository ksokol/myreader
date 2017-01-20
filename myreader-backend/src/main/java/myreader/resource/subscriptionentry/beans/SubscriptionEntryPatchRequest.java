package myreader.resource.subscriptionentry.beans;

import myreader.resource.service.patch.PatchSupport;

import javax.validation.constraints.Digits;

import static java.lang.Integer.MAX_VALUE;

/**
 * @author Kamill Sokol
 */
@SuppressWarnings("PMD.UselessOverridingMethod")
public class SubscriptionEntryPatchRequest extends PatchSupport {

    @Digits(integer = MAX_VALUE, fraction = 0)
    private String uuid;
    private String tag;
    private Boolean seen;

    public String getUuid() {
        return uuid;
    }

    public void setUuid(final String uuid) {
        this.addPatchedField("uuid");
        this.uuid = uuid;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.addPatchedField("tag");
        this.tag = tag;
    }

    public Boolean getSeen() {
        return seen;
    }

    public void setSeen(Boolean seen) {
        this.addPatchedField("seen");
        this.seen = seen;
    }
}
