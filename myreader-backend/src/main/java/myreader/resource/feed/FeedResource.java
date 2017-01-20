package myreader.resource.feed;

import myreader.entity.Feed;
import myreader.entity.FetchError;
import myreader.repository.FeedRepository;
import myreader.repository.FetchErrorRepository;
import myreader.repository.SubscriptionRepository;
import myreader.resource.exception.ResourceNotFoundException;
import myreader.resource.feed.beans.FeedGetResponse;
import myreader.resource.feed.beans.FeedPatchRequest;
import myreader.resource.feed.beans.FetchErrorGetResponse;
import myreader.resource.service.patch.PatchService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.PagedResources;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

import static org.springframework.web.bind.annotation.RequestMethod.DELETE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;

/**
 * @author Kamill Sokol
 */
@RestController
@RequestMapping(value = FeedResource.FEEDS_URL + "/{id}")
public class FeedResource {

    private static final String FETCH_ERROR_URL = "/fetchError";
    protected static final String FEEDS_URL = "/api/2/feeds/";

    private final PagedResourcesAssembler<FetchError> pagedResourcesAssembler;
    private final ResourceAssembler<Feed, FeedGetResponse> assembler;
    private final ResourceAssembler<FetchError, FetchErrorGetResponse> fetchErrorAssembler;
    private final FetchErrorRepository fetchErrorRepository;
    private final FeedRepository feedRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final PatchService patchService;

    public FeedResource(PagedResourcesAssembler<FetchError> pagedResourcesAssembler,
                        ResourceAssembler<Feed, FeedGetResponse> assembler,
                        ResourceAssembler<FetchError, FetchErrorGetResponse> fetchErrorAssembler,
                        FeedRepository feedRepository,
                        FetchErrorRepository fetchErrorRepository,
                        SubscriptionRepository subscriptionRepository,
                        PatchService patchService) {
        this.pagedResourcesAssembler = pagedResourcesAssembler;
        this.assembler = assembler;
        this.fetchErrorAssembler = fetchErrorAssembler;
        this.feedRepository = feedRepository;
        this.fetchErrorRepository = fetchErrorRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.patchService = patchService;
    }

    @RequestMapping(value = "", method = GET)
    public FeedGetResponse get(@PathVariable("id") Long id) {
        Feed feed = feedRepository.findOne(id);
        if(feed != null) {
            return assembler.toResource(feed);
        } else {
            return new FeedGetResponse();
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @RequestMapping(value = "", method = DELETE)
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        int count = subscriptionRepository.countByFeedId(id);

        if(count > 0) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        if(!feedRepository.exists(id)) {
            return ResponseEntity.notFound().build();
        }

        feedRepository.delete(id);

        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @RequestMapping(value = "", method = RequestMethod.PATCH)
    public FeedGetResponse patch(@PathVariable("id") Long id, @Valid @RequestBody FeedPatchRequest request) {
        Feed feed = findOrThrowException(id);
        Feed patchedFeed = patchService.patch(request, feed);
        feedRepository.save(patchedFeed);
        return get(id);
    }

    @RequestMapping(value = FETCH_ERROR_URL, method = GET)
    public PagedResources<FetchErrorGetResponse> getFetchError(@PathVariable("id") Long id, Pageable pageable) {
        Page<FetchError> page = fetchErrorRepository.findByFeedIdOrderByCreatedAtDesc(id, pageable);
        return pagedResourcesAssembler.toResource(page, fetchErrorAssembler, new Link(FEEDS_URL + id + FETCH_ERROR_URL));
    }

    private Feed findOrThrowException(Long id) {
        Feed feed = feedRepository.findOne(id);
        if(feed == null) {
            throw new ResourceNotFoundException();
        }
        return feed;
    }
}
