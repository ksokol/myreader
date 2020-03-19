package myreader.resource.feed.assembler;

import myreader.entity.Feed;
import myreader.repository.FetchErrorRepository;
import myreader.resource.feed.FeedResource;
import myreader.resource.feed.beans.FeedGetResponse;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.stereotype.Component;

import static java.util.Objects.requireNonNull;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

/**
 * @author Kamill Sokol
 */
@Component
public class FeedGetResponseAssemblerSupport extends RepresentationModelAssemblerSupport<Feed, FeedGetResponse> {

    private final FetchErrorRepository fetchErrorRepository;

    public FeedGetResponseAssemblerSupport(FetchErrorRepository fetchErrorRepository) {
        super(Feed.class, FeedGetResponse.class);
        this.fetchErrorRepository = requireNonNull(fetchErrorRepository, "fetchErrorRepository is null");
    }

    @Override
    public FeedGetResponse toModel(Feed source) {
        FeedGetResponse target = new FeedGetResponse();

        target.setUuid(source.getId().toString());
        target.setTitle(source.getTitle());
        target.setUrl(source.getUrl());
        target.setFetched(source.getFetched());
        target.setLastModified(source.getLastModified());
        target.setHasErrors(fetchErrorRepository.countByFeedId(source.getId()) > 0);
        target.setCreatedAt(source.getCreatedAt());

        target.add(linkTo(methodOn(FeedResource.class).getFetchError(source.getId(), null)).withRel("fetchErrors"));

        return target;
    }
}
