package myreader.resource.exclusionpattern.assembler;

import myreader.entity.ExclusionPattern;
import myreader.resource.exclusionpattern.beans.ExclusionPatternGetResponse;
import org.springframework.stereotype.Component;
import spring.hateoas.ResourceAssemblerSupport;

/**
 * @author Kamill Sokol
 */
@Component
public class ExclusionPatternGetResponseAssemblerSupport extends ResourceAssemblerSupport<ExclusionPattern, ExclusionPatternGetResponse> {

    public ExclusionPatternGetResponseAssemblerSupport() {
        super(ExclusionPattern.class, ExclusionPatternGetResponse.class);
    }

    @Override
    public ExclusionPatternGetResponse toResource(ExclusionPattern source) {
        ExclusionPatternGetResponse target = new ExclusionPatternGetResponse();

        target.setUuid(String.valueOf(source.getId()));
        target.setPattern(source.getPattern());
        target.setHitCount(source.getHitCount());

        return target;
    }
}
