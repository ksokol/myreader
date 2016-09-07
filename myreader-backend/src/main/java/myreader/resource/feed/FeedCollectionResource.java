package myreader.resource.feed;

import myreader.entity.Feed;
import myreader.repository.FeedRepository;
import myreader.resource.feed.beans.FeedGetResponse;
import myreader.resource.feed.beans.FeedProbeRequest;
import org.slf4j.Logger;
import org.springframework.data.domain.PageImpl;
import org.springframework.hateoas.PagedResources;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import spring.hateoas.ResourceAssemblers;

import javax.validation.Valid;
import java.util.List;

import static org.slf4j.LoggerFactory.getLogger;

/**
 * @author Kamill Sokol
 */
@RestController
@RequestMapping(value = "api/2/feeds")
public class FeedCollectionResource {

    private static final Logger LOG = getLogger(FeedCollectionResource.class);

    private final FeedRepository feedRepository;
    private final ResourceAssemblers resourceAssemblers;

    public FeedCollectionResource(FeedRepository feedRepository, ResourceAssemblers resourceAssemblers) {
        this.feedRepository = feedRepository;
        this.resourceAssemblers = resourceAssemblers;
    }

    @RequestMapping(value = "", method = RequestMethod.GET)
    public PagedResources<FeedGetResponse> get() {
        List<Feed> feeds = feedRepository.findAll();
        return resourceAssemblers.toResource(new PageImpl<>(feeds), FeedGetResponse.class);
    }

    @RequestMapping(value = "probe", method = RequestMethod.POST)
    public void probe(@Valid @RequestBody FeedProbeRequest request) {
        LOG.info("probe {}", request.getUrl());
    }
}
