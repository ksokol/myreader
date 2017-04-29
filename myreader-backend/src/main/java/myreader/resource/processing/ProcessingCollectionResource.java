package myreader.resource.processing;

import myreader.entity.Feed;
import myreader.fetcher.FeedQueue;
import myreader.repository.FeedRepository;
import myreader.resource.processing.beans.ProcessedFeedGetResponse;
import myreader.resource.processing.beans.ProcessingPutRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.AsyncResult;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.Future;

/**
 * @author Kamill Sokol
 */
@PreAuthorize("hasRole('ROLE_ADMIN')")
@RestController
@RequestMapping(value = "api/2/processing")
public class ProcessingCollectionResource {

    private final FeedRepository feedRepository;
    private final FeedQueue feedQueue;
    private final ApplicationContext applicationContext;
    private final PagedResourcesAssembler<Feed> pagedResourcesAssembler;
    private final ResourceAssemblerSupport<Feed, ProcessedFeedGetResponse> assembler;

    @Autowired
    public ProcessingCollectionResource(final FeedRepository feedRepository,
                                        final FeedQueue feedQueue,
                                        final ApplicationContext applicationContext,
                                        final PagedResourcesAssembler<Feed> pagedResourcesAssembler,
                                        final ResourceAssemblerSupport<Feed, ProcessedFeedGetResponse> assembler) {
        this.feedRepository = feedRepository;
        this.feedQueue = feedQueue;
        this.applicationContext = applicationContext;
        this.pagedResourcesAssembler = pagedResourcesAssembler;
        this.assembler = assembler;
    }

    //TODO rename mapping
    @RequestMapping(value = "feeds", method = RequestMethod.GET)
    public PagedResources<ProcessedFeedGetResponse> feeds(Pageable pageable) {
        final List<String> snapshot = feedQueue.getSnapshot();
        if(snapshot.isEmpty()) {
            return pagedResourcesAssembler.toResource(new PageImpl<>(Collections.emptyList()), assembler);
        }
        final Page<Feed> feeds = feedRepository.findByUrlIn(snapshot, pageable);
        return pagedResourcesAssembler.toResource(feeds, assembler);
    }

    //TODO
    @Async
    @RequestMapping(value = "", method = RequestMethod.PUT)
    public Future<Void> runProcess(@Valid @RequestBody ProcessingPutRequest request) {
        final Runnable runnable = applicationContext.getBean(request.getProcess(), Runnable.class);
        runnable.run();
        return new AsyncResult<>(null);
    }
}
