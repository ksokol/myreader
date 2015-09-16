package myreader.resource.user.beans;

import spring.hateoas.UUIDResourceSupport;

/**
 * @author Kamill Sokol
 */
public class UserGetResponse extends UUIDResourceSupport {

    private String email;
    private String role;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    @Override
    public int hashCode() {
        return getUuid().hashCode();
    }

    @Override
    public boolean equals(final Object object) {
        if (this == object) {
            return true;
        }

        if (object == null || !object.getClass().equals(this.getClass())) {
            return false;
        }

        UserGetResponse that = (UserGetResponse) object;

        return this.getUuid().equals(that.getUuid());
    }
}
