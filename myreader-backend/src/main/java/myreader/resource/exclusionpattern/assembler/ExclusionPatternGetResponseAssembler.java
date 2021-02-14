package myreader.resource.exclusionpattern.assembler;

import myreader.entity.ExclusionPattern;
import myreader.resource.exclusionpattern.beans.ExclusionPatternGetResponse;
import org.springframework.stereotype.Component;

@Component
public class ExclusionPatternGetResponseAssembler {

  public ExclusionPatternGetResponse toModel(ExclusionPattern source) {
    ExclusionPatternGetResponse target = new ExclusionPatternGetResponse();

    target.setUuid(String.valueOf(source.getId()));
    target.setPattern(source.getPattern());
    target.setHitCount(source.getHitCount());

    return target;
  }
}
