package myreader.resource.feed;

import myreader.entity.Feed;
import myreader.entity.FetchError;
import myreader.repository.FeedRepository;
import myreader.repository.FetchErrorRepository;
import myreader.repository.SubscriptionRepository;
import myreader.resource.feed.beans.FeedGetResponse;
import myreader.resource.feed.beans.FeedPatchRequest;
import myreader.resource.feed.beans.FeedPatchRequestValidator;
import myreader.resource.feed.beans.FetchErrorGetResponse;
import myreader.service.feed.FeedService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import static myreader.resource.ResourceConstants.FEED;
import static myreader.resource.ResourceConstants.FEED_FETCH_ERROR;

/**
 * @author Kamill Sokol
 */
@RestController
public class FeedResource {

    private final PagedResourcesAssembler<FetchError> pagedResourcesAssembler;
    private final RepresentationModelAssembler<Feed, FeedGetResponse> assembler;
    private final RepresentationModelAssembler<FetchError, FetchErrorGetResponse> fetchErrorAssembler;
    private final FetchErrorRepository fetchErrorRepository;
    private final FeedRepository feedRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final FeedService feedService;

    public FeedResource(
            PagedResourcesAssembler<FetchError> pagedResourcesAssembler,
            RepresentationModelAssembler<Feed, FeedGetResponse> assembler,
            RepresentationModelAssembler<FetchError, FetchErrorGetResponse> fetchErrorAssembler,
            FeedRepository feedRepository,
            FetchErrorRepository fetchErrorRepository,
            SubscriptionRepository subscriptionRepository,
            FeedService feedService) {
        this.pagedResourcesAssembler = pagedResourcesAssembler;
        this.assembler = assembler;
        this.fetchErrorAssembler = fetchErrorAssembler;
        this.feedRepository = feedRepository;
        this.fetchErrorRepository = fetchErrorRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.feedService = feedService;
    }

    @InitBinder
    protected void binder(WebDataBinder binder) {
        binder.addValidators(new FeedPatchRequestValidator(feedService));
    }

    @GetMapping(FEED)
    public FeedGetResponse get(@PathVariable("id") Long id) {
        return feedRepository.findById(id)
                .map(assembler::toModel)
                .orElseGet(FeedGetResponse::new);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping(FEED)
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        int count = subscriptionRepository.countByFeedId(id);

        if (count > 0) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        if (!feedRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        feedRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PatchMapping(FEED)
    public FeedGetResponse patch(@PathVariable("id") Long id, @Validated @RequestBody FeedPatchRequest request) {
        Feed feed = findOrThrowException(id);

        feed.setUrl(request.getUrl());
        feed.setTitle(request.getTitle());

        feedRepository.save(feed);
        return get(id);
    }

    @GetMapping(FEED_FETCH_ERROR)
    public PagedModel<FetchErrorGetResponse> getFetchError(@PathVariable("id") Long id, Pageable pageable) {
        Page<FetchError> page = fetchErrorRepository.findByFeedIdOrderByCreatedAtDesc(id, pageable);
        return pagedResourcesAssembler.toModel(page, fetchErrorAssembler);
    }

    private Feed findOrThrowException(Long id) {
        return feedRepository
                .findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }
}
