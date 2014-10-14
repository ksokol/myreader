package myreader.resource.user.assembler;

import myreader.resource.user.UserEntityResource;
import myreader.resource.user.beans.UserGetResponse;

import org.springframework.stereotype.Component;

import spring.data.EntityLinksSupport;

/**
 * @author Kamill Sokol
 */
@Component
public class UserGetResponseEntityLinks extends EntityLinksSupport {

    public UserGetResponseEntityLinks() {
        super(UserGetResponse.class, UserEntityResource.class);
    }
}
