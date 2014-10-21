package myreader.entity;

/**
 * @author Kamill Sokol
 */
public class SubscriptionEntryTagGroup {

    private final String tag;
    private final long count;

    public SubscriptionEntryTagGroup(String tag, long count) {
        this.tag = tag;
        this.count = count;
    }

    public String getTag() {
        return tag;
    }

    public long getCount() {
        return count;
    }
}
