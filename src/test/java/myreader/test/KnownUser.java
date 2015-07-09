package myreader.test;

/**
 * @author Kamill Sokol
 */
public enum KnownUser {
    ADMIN(0, "user0@localhost","0", true),
    USER1(1, "user1@localhost","1", false),
    USER2(2, "user2@localhost","2", false),
    USER3(3, "user3@localhost","3", false),
    USER4(4, "user4@localhost","4", false),
    USER100(100, "user100@localhost","4", false),
    USER102(102, "user102@localhost","4", false),
    USER103(103, "user103@localhost","4", false),
    USER104(104, "user104@localhost","4", false);

    KnownUser(long id, String username, String password, boolean admin) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.admin = admin;
    }

    public final long id;
    public final String username;
    public final String password;
    public final boolean admin;
}
