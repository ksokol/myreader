package myreader.resource.feed;

import myreader.entity.Feed;
import myreader.entity.FetchError;
import myreader.repository.FeedRepository;
import myreader.repository.FetchErrorRepository;
import myreader.resource.feed.beans.FeedGetResponse;
import myreader.resource.feed.beans.FetchErrorGetResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import static myreader.resource.ResourceConstants.FEED;
import static myreader.resource.ResourceConstants.FEED_FETCH_ERROR;

@RestController
public class FeedResource {

  private final PagedResourcesAssembler<FetchError> pagedResourcesAssembler;
  private final RepresentationModelAssembler<Feed, FeedGetResponse> assembler;
  private final RepresentationModelAssembler<FetchError, FetchErrorGetResponse> fetchErrorAssembler;
  private final FetchErrorRepository fetchErrorRepository;
  private final FeedRepository feedRepository;

  public FeedResource(
    PagedResourcesAssembler<FetchError> pagedResourcesAssembler,
    RepresentationModelAssembler<Feed, FeedGetResponse> assembler,
    RepresentationModelAssembler<FetchError, FetchErrorGetResponse> fetchErrorAssembler,
    FeedRepository feedRepository,
    FetchErrorRepository fetchErrorRepository
  ) {
    this.pagedResourcesAssembler = pagedResourcesAssembler;
    this.assembler = assembler;
    this.fetchErrorAssembler = fetchErrorAssembler;
    this.feedRepository = feedRepository;
    this.fetchErrorRepository = fetchErrorRepository;
  }

  @GetMapping(FEED)
  public FeedGetResponse get(@PathVariable("id") Long id) {
    return feedRepository.findById(id)
      .map(assembler::toModel)
      .orElseGet(FeedGetResponse::new);
  }

  @GetMapping(FEED_FETCH_ERROR)
  public PagedModel<FetchErrorGetResponse> getFetchError(@PathVariable("id") Long id, Pageable pageable) {
    Page<FetchError> page = fetchErrorRepository.findByFeedIdOrderByCreatedAtDesc(id, pageable);
    return pagedResourcesAssembler.toModel(page, fetchErrorAssembler);
  }
}
