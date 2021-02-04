package myreader.test;

import myreader.entity.User;

public enum TestUser {

    USER1(1L, TestConstants.USER1),
    USER2(2L, "user2@localhost"),
    USER4(4L, "user4@localhost");

    public final long id;
    public final String email;
    public final String password;
    public final String passwordHash;

    TestUser(long id, String email) {
        this.id = id;
        this.email = email;
        this.password = "0";
        this.passwordHash = "{MD5}cfcd208495d565ef66e7dff9f98764da";
    }

    public User toUser() {
        var user = new User(this.email);
        user.setId(this.id);
        user.setPassword(this.passwordHash);
        return user;
    }
}
