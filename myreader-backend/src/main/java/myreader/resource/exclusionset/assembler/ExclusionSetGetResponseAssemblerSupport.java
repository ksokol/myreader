package myreader.resource.exclusionset.assembler;

import myreader.entity.ExclusionSet;
import myreader.resource.exclusionset.beans.ExclusionSetGetResponse;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.stereotype.Component;

/**
 * @author Kamill Sokol
 */
@Component
public class ExclusionSetGetResponseAssemblerSupport extends RepresentationModelAssemblerSupport<ExclusionSet, ExclusionSetGetResponse> {

    public ExclusionSetGetResponseAssemblerSupport() {
        super(ExclusionSet.class, ExclusionSetGetResponse.class);
    }

    @Override
    public ExclusionSetGetResponse toModel(ExclusionSet source) {
        ExclusionSetGetResponse target = new ExclusionSetGetResponse();

        target.setUuid(String.valueOf(source.getSubscriptionId()));
        target.setPatternCount(source.getPatternCount());
        target.setOverallPatternHits(source.getOverallPatternHitCount());

        return target;
    }
}
