package myreader.resource.processing.assembler;

import myreader.entity.Feed;
import myreader.resource.processing.beans.ProcessedFeedGetResponse;
import org.springframework.stereotype.Component;
import spring.hateoas.ResourceAssemblerSupport;

/**
 * @author Kamill Sokol
 */
@Component
public class ProcessedFeedGetResponseAssemblerSupport extends ResourceAssemblerSupport<Feed, ProcessedFeedGetResponse> {

    public ProcessedFeedGetResponseAssemblerSupport() {
        super(Feed.class, ProcessedFeedGetResponse.class);
    }

    @Override
    public ProcessedFeedGetResponse toResource(final Feed source) {
        final ProcessedFeedGetResponse target = new ProcessedFeedGetResponse();
        target.setTitle(source.getTitle());
        target.setCreatedAt(source.getCreatedAt());
        target.setFetched(source.getFetched());
        target.setLastModified(source.getLastModified());
        target.setOrigin(source.getUrl());
        target.setUuid(String.valueOf(source.getId()));
        return target;
    }
}
