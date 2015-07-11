package myreader.test;

/**
 * @author Kamill Sokol
 */
public enum KnownUser {
    ADMIN(0,"0", true),
    USER1(1,"1"),
    USER2(2,"2"),
    USER3(3,"3"),
    USER4(4,"4"),
    USER100(100,"4"),
    USER102(102,"4"),
    USER103(103,"4"),
    USER104(104,"4"),
    USER105(105,"4"),
    USER106(106,"4");

    KnownUser(long id, String password) {
        this(id, password, false);
    }

    KnownUser(long id, String password, boolean admin) {
        this.id = id;
        this.username = "user" + id + "@localhost";
        this.password = password;
        this.admin = admin;
    }

    public final long id;
    public final String username;
    public final String password;
    public final boolean admin;
}
