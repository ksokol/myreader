package myreader.entity;

/**
 * @author Kamill Sokol
 */
public class TagGroup {

    private final long id;
    private final String name;
    private final long unseen;
    private final Type type;

    public TagGroup(String name, long unseen) {
        this(0, name, unseen, Type.AGGREGATE);
    }

    public TagGroup(long id, String name, long unseen) {
        this(id, name, unseen, Type.AGGREGATE);
    }

    public TagGroup(long id, String name, long unseen, Type type) {
        this.id = id;
        this.name = name;
        this.unseen = unseen;
        this.type = type;
    }

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public long getUnseen() {
        return unseen;
    }

    public Type getType() {
        return type;
    }

    public enum Type {
        SUBSCRIPTION, AGGREGATE;
    }
}
