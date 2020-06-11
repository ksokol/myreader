package myreader.resource.subscriptionentry.beans;

import java.util.Objects;

/**
 * @author Kamill Sokol
 */
public class SubscriptionEntryPatchRequest {

    private String uuid;
    private String tag;
    private Boolean seen;

    public String getUuid() {
        return uuid;
    }

    public void setUuid(final String uuid) {
        this.uuid = uuid;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public Boolean getSeen() {
        return seen;
    }

    public void setSeen(Boolean seen) {
        this.seen = seen;
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) {
            return true;
        }
        if (!(other instanceof SubscriptionEntryPatchRequest)) {
            return false;
        }
        SubscriptionEntryPatchRequest that = (SubscriptionEntryPatchRequest) other;
        return Objects.equals(uuid, that.uuid) &&
                Objects.equals(tag, that.tag) &&
                Objects.equals(seen, that.seen);
    }

    @Override
    public int hashCode() {
        return Objects.hash(uuid, tag, seen);
    }
}
