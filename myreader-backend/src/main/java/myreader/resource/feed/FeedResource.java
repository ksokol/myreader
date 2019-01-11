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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

import static myreader.resource.ResourceConstants.FEED_FETCH_ERROR_URL;
import static myreader.resource.ResourceConstants.FEED_URL;
import static org.springframework.web.bind.annotation.RequestMethod.DELETE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.PATCH;

/**
 * @author Kamill Sokol
 */
@RestController
public class FeedResource {

    private final PagedResourcesAssembler<FetchError> pagedResourcesAssembler;
    private final ResourceAssembler<Feed, FeedGetResponse> assembler;
    private final ResourceAssembler<FetchError, FetchErrorGetResponse> fetchErrorAssembler;
    private final FetchErrorRepository fetchErrorRepository;
    private final FeedRepository feedRepository;
    private final SubscriptionRepository subscriptionRepository;

    public FeedResource(PagedResourcesAssembler<FetchError> pagedResourcesAssembler,
                        ResourceAssembler<Feed, FeedGetResponse> assembler,
                        ResourceAssembler<FetchError, FetchErrorGetResponse> fetchErrorAssembler,
                        FeedRepository feedRepository,
                        FetchErrorRepository fetchErrorRepository,
                        SubscriptionRepository subscriptionRepository) {
        this.pagedResourcesAssembler = pagedResourcesAssembler;
        this.assembler = assembler;
        this.fetchErrorAssembler = fetchErrorAssembler;
        this.feedRepository = feedRepository;
        this.fetchErrorRepository = fetchErrorRepository;
        this.subscriptionRepository = subscriptionRepository;
    }

    @RequestMapping(value = FEED_URL, method = GET)
    public FeedGetResponse get(@PathVariable("id") Long id) {
        return feedRepository.findById(id)
                .map(assembler::toResource)
                .orElseGet(FeedGetResponse::new);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @RequestMapping(value = FEED_URL, method = DELETE)
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        int count = subscriptionRepository.countByFeedId(id);

        if(count > 0) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        if(!feedRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        feedRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @RequestMapping(value = FEED_URL, method = PATCH)
    public FeedGetResponse patch(@PathVariable("id") Long id, @Valid @RequestBody FeedPatchRequest request) {
        Feed feed = findOrThrowException(id);

        feed.setUrl(request.getUrl());
        feed.setTitle(request.getTitle());

        feedRepository.save(feed);
        return get(id);
    }

    @RequestMapping(value = FEED_FETCH_ERROR_URL, method = GET)
    public PagedResources<FetchErrorGetResponse> getFetchError(@PathVariable("id") Long id, Pageable pageable) {
        Page<FetchError> page = fetchErrorRepository.findByFeedIdOrderByCreatedAtDesc(id, pageable);
        return pagedResourcesAssembler.toResource(page, fetchErrorAssembler);
    }

    private Feed findOrThrowException(Long id) {
        return feedRepository
                .findById(id)
                .orElseThrow(ResourceNotFoundException::new);
    }
}
