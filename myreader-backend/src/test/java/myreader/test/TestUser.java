package myreader.test;

/**
 * @author Kamill Sokol
 */
public enum TestUser {

    ADMIN(0L, TestConstants.ADMIN, "ROLE_ADMIN"),
    USER1(1L, TestConstants.USER1, "ROLE_USER"),
    USER2(2L, TestConstants.USER2, "ROLE_USER"),
    USER4(4L, TestConstants.USER4, "ROLE_USER");

    public final long id;
    public final String email;
    public final String password;
    public final String role;

    TestUser(long id, String email, String role) {
        this.id = id;
        this.email = email;
        this.password = "Test1";
        this.role = role;
    }
}
