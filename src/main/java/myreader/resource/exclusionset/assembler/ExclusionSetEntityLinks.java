package myreader.resource.exclusionset.assembler;

import myreader.resource.exclusionset.ExclusionSetCollectionResource;
import myreader.resource.exclusionset.beans.ExclusionSetGetResponse;

import org.springframework.stereotype.Component;

import spring.data.EntityLinksSupport;

/**
 * @author Kamill Sokol
 */
@Component
public class ExclusionSetEntityLinks extends EntityLinksSupport {

    public ExclusionSetEntityLinks() {
        super(ExclusionSetGetResponse.class, ExclusionSetCollectionResource.class);
    }
}
