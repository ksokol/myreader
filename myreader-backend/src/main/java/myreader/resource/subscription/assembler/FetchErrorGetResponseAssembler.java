package myreader.resource.subscription.assembler;

import myreader.entity.FetchError;
import myreader.resource.subscription.beans.FetchErrorGetResponse;
import org.springframework.stereotype.Component;

@Component
public class FetchErrorGetResponseAssembler {

  public FetchErrorGetResponse toModel(FetchError source) {
    FetchErrorGetResponse target = new FetchErrorGetResponse();

    target.setUuid(source.getId().toString());
    target.setMessage(source.getMessage());
    target.setCreatedAt(source.getCreatedAt());

    return target;
  }
}
