package myreader.resource.feed.assembler;

import myreader.entity.FetchError;
import myreader.resource.feed.beans.FetchErrorGetResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;
import org.springframework.stereotype.Component;

/**
 * @author Kamill Sokol
 */
@Component
public class FetchErrorGetResponseAssemblerSupport extends ResourceAssemblerSupport<FetchError, FetchErrorGetResponse> {

    private final int retainDays;

    public FetchErrorGetResponseAssemblerSupport(@Value("${job.fetchError.retainInDays}") int retainDays) {
        super(FetchError.class, FetchErrorGetResponse.class);
        this.retainDays = retainDays;
    }

    @Override
    public FetchErrorGetResponse toResource(FetchError source) {
        FetchErrorGetResponse target = new FetchErrorGetResponse();

        target.setUuid(source.getId().toString());
        target.setMessage(source.getMessage());
        target.setRetainDays(retainDays);
        target.setCreatedAt(source.getCreatedAt());

        return target;
    }
}
