package myreader.test;

/**
 * @author Kamill Sokol
 */
@Deprecated
public enum KnownUser {

    ADMIN(true),
    USER1,
    USER2,
    USER3,
    USER100,
    USER111,
    USER113,
    USER114,
    USER115;

    public final long id;
    public final String username;
    public final String password;
    public final String role;
    public final boolean admin;

    KnownUser() {
        this(false);
    }

    KnownUser(boolean admin) {
        if(name().startsWith("USER")) {
            final Integer integer = Integer.valueOf(name().substring(4));
            this.id = integer.intValue();
        } else {
            this.id = 0;
        }

        this.password = "0";
        this.admin = admin;
        this.username = "user" + this.id + "@localhost";
        this.role = this.admin ? "ROLE_ADMIN" : "ROLE_USER";
    }
}
