package myreader.resource.exclusionset.assembler;

import myreader.resource.exclusionset.ExclusionSetCollectionResource;
import myreader.resource.exclusionset.beans.ExclusionSetGetResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.stereotype.Component;
import spring.data.EntityLinksSupport;

/**
 * @author Kamill Sokol
 */
@Component
public class ExclusionSetEntityLinks extends EntityLinksSupport {

    @Autowired
    public ExclusionSetEntityLinks(PagedResourcesAssembler pagedResourcesAssembler) {
        super(ExclusionSetGetResponse.class, ExclusionSetCollectionResource.class, pagedResourcesAssembler);
    }
}
