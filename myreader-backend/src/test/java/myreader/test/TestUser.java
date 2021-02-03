package myreader.test;

import myreader.entity.User;

public enum TestUser {

    ADMIN(0L, "admin@localhost", "ROLE_ADMIN"),
    USER1(1L, TestConstants.USER1, "ROLE_USER"),
    USER2(2L, "user2@localhost", "ROLE_USER"),
    USER4(4L, "user4@localhost", "ROLE_USER");

    public final long id;
    public final String email;
    public final String password;
    public final String passwordHash;
    public final String role;

    TestUser(long id, String email, String role) {
        this.id = id;
        this.email = email;
        this.password = "0";
        this.passwordHash = "{MD5}cfcd208495d565ef66e7dff9f98764da";
        this.role = role;
    }

    public User toUser() {
        var user = new User(this.email);
        user.setId(this.id);
        user.setPassword(this.passwordHash);
        user.setRole(this.role);
        return user;
    }
}
