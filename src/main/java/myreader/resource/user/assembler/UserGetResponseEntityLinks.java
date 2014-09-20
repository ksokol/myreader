package myreader.resource.user.assembler;

import myreader.resource.user.UserEntityResource;
import myreader.resource.user.beans.UserGetResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.stereotype.Component;
import spring.data.EntityLinksSupport;

/**
 * @author Kamill Sokol
 */
@Component
public class UserGetResponseEntityLinks extends EntityLinksSupport {

    @Autowired
    public UserGetResponseEntityLinks(PagedResourcesAssembler pagedResourcesAssembler) {
        super(UserGetResponse.class, UserEntityResource.class, pagedResourcesAssembler);
    }
}
