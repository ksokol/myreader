package myreader.entity;

/**
 * @author Kamill Sokol
 */
public class TagGroup {

    private final String tag;
    private final long unseen;

    public TagGroup(String tag, long unseen) {
        this.tag = tag;
        this.unseen = unseen;
    }

    public String getTag() {
        return tag;
    }

    public long getUnseen() {
        return unseen;
    }
}
