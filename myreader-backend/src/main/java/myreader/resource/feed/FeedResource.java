package myreader.resource.feed;

import myreader.entity.Feed;
import myreader.entity.FetchError;
import myreader.repository.FeedRepository;
import myreader.repository.FetchErrorRepository;
import myreader.resource.feed.beans.FeedGetResponse;
import myreader.resource.feed.beans.FetchErrorGetResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.PagedResources;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import spring.hateoas.ResourceAssemblers;

import static org.springframework.web.bind.annotation.RequestMethod.DELETE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;

/**
 * @author Kamill Sokol
 */
@RestController
@RequestMapping(value = "api/2/feeds/{id}")
public class FeedResource {

    private final FetchErrorRepository fetchErrorRepository;
    private final FeedRepository feedRepository;
    private final ResourceAssemblers resourceAssemblers;

    public FeedResource(FeedRepository feedRepository, FetchErrorRepository fetchErrorRepository, ResourceAssemblers resourceAssemblers) {
        this.feedRepository = feedRepository;
        this.fetchErrorRepository = fetchErrorRepository;
        this.resourceAssemblers = resourceAssemblers;
    }

    @RequestMapping(value = "", method = GET)
    public FeedGetResponse get(@PathVariable("id") Long id) {
        Feed feed = feedRepository.findOne(id);
        if(feed != null) {
            return resourceAssemblers.toResource(feed, FeedGetResponse.class);
        } else {
            return new FeedGetResponse();
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @RequestMapping(value = "", method = DELETE)
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        int count = feedRepository.countSubscriptionsByFeedId(id);

        if(count > 0) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        if(!feedRepository.exists(id)) {
            return ResponseEntity.notFound().build();
        }

        feedRepository.delete(id);

        return ResponseEntity.noContent().build();
    }

    @RequestMapping(value = "fetchError", method = GET)
    public PagedResources<FetchErrorGetResponse> getFetchError(@PathVariable("id") Long id, Pageable pageable) {
        Page<FetchError> page = fetchErrorRepository.findByFeedIdOrderByCreatedAtDesc(id, pageable);
        return resourceAssemblers.toResource(page, FetchErrorGetResponse.class);
    }

}
