package myreader.resource.user.beans;

import myreader.resource.service.patch.PatchSupport;

import javax.validation.constraints.NotNull;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
public class UserPatchRequest extends PatchSupport {

    @NotNull
    private String password;

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
