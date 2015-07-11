package myreader.test;

/**
 * @author Kamill Sokol
 */
public enum KnownUser {
    ADMIN(0,true),
    USER1(1),
    USER2(2),
    USER3(3),
    USER4(4),
    USER100(100),
    USER102(102),
    USER103(103),
    USER104(104),
    USER105(105),
    USER106(106);

    KnownUser(long id) {
        this(id, false);
    }

    KnownUser(long id, boolean admin) {
        this.id = id;
        this.username = "user" + id + "@localhost";
        this.password = "0";
        this.admin = admin;
    }

    public final long id;
    public final String username;
    public final String password;
    public final boolean admin;
}
