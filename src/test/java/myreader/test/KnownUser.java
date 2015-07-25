package myreader.test;

/**
 * @author Kamill Sokol
 */
public enum KnownUser {
    ADMIN(true),
    USER1,
    USER2,
    USER3,
    USER4,
    USER100,
    USER102,
    USER103,
    USER104,
    USER105,
    USER106,
    USER107,
    USER108,
    USER109,
    USER110,
    USER111;

    KnownUser() {
        this(false);
    }

    KnownUser(boolean admin) {
        if(name().startsWith("USER")) {
            this.id = Integer.valueOf(name().substring(4));
        } else {
            this.id = 0;
        }

        this.password = "0";
        this.admin = admin;
        this.username = "user" + this.id + "@localhost";
    }

    public final long id;
    public final String username;
    public final String password;
    public final boolean admin;
}
