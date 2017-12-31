package myreader.resource.feed;

import myreader.entity.Feed;
import myreader.repository.FeedRepository;
import myreader.resource.feed.beans.FeedGetResponse;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @author Kamill Sokol
 */
@RestController
@RequestMapping(value = "api/2/feeds")
public class FeedCollectionResource {

    private final PagedResourcesAssembler<Feed> pagedResourcesAssembler;
    private final ResourceAssembler<Feed, FeedGetResponse> assembler;
    private final FeedRepository feedRepository;

    public FeedCollectionResource(FeedRepository feedRepository,
                                  PagedResourcesAssembler<Feed> pagedResourcesAssembler,
                                  ResourceAssembler<Feed, FeedGetResponse> assembler) {
        this.pagedResourcesAssembler = pagedResourcesAssembler;
        this.feedRepository = feedRepository;
        this.assembler = assembler;
    }

    @RequestMapping(value = "", method = RequestMethod.GET)
    public PagedResources<FeedGetResponse> get() {
        List<Feed> feeds = feedRepository.findAll();

        // TODO Add proper pagination
        PageRequest pageRequest = new PageRequest(0, feeds.size());
        return pagedResourcesAssembler.toResource(new PageImpl<>(feeds, pageRequest, feeds.size()), assembler);
    }
}
