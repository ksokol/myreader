package myreader.resource.user.beans;

import org.springframework.hateoas.ResourceSupport;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
public class UserGetResponse extends ResourceSupport {

    private Long id;
    private String email;
    private String role;

    public void setId(Long id) {
        this.id = id;
    }

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
}
