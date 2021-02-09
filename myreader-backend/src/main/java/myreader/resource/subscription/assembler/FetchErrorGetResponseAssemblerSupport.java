package myreader.resource.subscription.assembler;

import myreader.entity.FetchError;
import myreader.resource.subscription.beans.FetchErrorGetResponse;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.stereotype.Component;

@Component
public class FetchErrorGetResponseAssemblerSupport extends RepresentationModelAssemblerSupport<FetchError, FetchErrorGetResponse> {

  public FetchErrorGetResponseAssemblerSupport() {
    super(FetchError.class, FetchErrorGetResponse.class);
  }

  @Override
  public FetchErrorGetResponse toModel(FetchError source) {
    FetchErrorGetResponse target = new FetchErrorGetResponse();

    target.setUuid(source.getId().toString());
    target.setMessage(source.getMessage());
    target.setCreatedAt(source.getCreatedAt());

    return target;
  }
}
