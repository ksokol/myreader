package myreader.resource.feed;

import myreader.entity.Feed;
import myreader.repository.FeedRepository;
import myreader.resource.feed.beans.FeedGetResponse;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import static myreader.resource.ResourceConstants.FEEDS;

@RestController
public class FeedCollectionResource {

    private final PagedResourcesAssembler<Feed> pagedResourcesAssembler;
    private final RepresentationModelAssembler<Feed, FeedGetResponse> assembler;
    private final FeedRepository feedRepository;

    public FeedCollectionResource(
            FeedRepository feedRepository,
            PagedResourcesAssembler<Feed> pagedResourcesAssembler,
            RepresentationModelAssembler<Feed, FeedGetResponse> assembler
    ) {
        this.pagedResourcesAssembler = pagedResourcesAssembler;
        this.feedRepository = feedRepository;
        this.assembler = assembler;
    }

    @GetMapping(FEEDS)
    public PagedModel<FeedGetResponse> get() {
        var feeds = feedRepository.findAllByOrderByCreatedAtDesc();

        var pageRequest = PageRequest.of(0, feeds.size());
        return pagedResourcesAssembler.toModel(new PageImpl<>(feeds, pageRequest, feeds.size()), assembler);
    }
}
