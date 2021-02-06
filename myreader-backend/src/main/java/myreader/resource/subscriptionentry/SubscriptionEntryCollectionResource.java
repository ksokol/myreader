package myreader.resource.subscriptionentry;

import myreader.entity.SubscriptionEntry;
import myreader.repository.SubscriptionEntryRepository;
import myreader.resource.subscriptionentry.beans.SearchRequest;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.PagedModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;

import static myreader.resource.ResourceConstants.SUBSCRIPTION_ENTRIES;
import static myreader.resource.ResourceConstants.SUBSCRIPTION_ENTRIES_AVAILABLE_TAGS;

@RestController
public class SubscriptionEntryCollectionResource {

  private final RepresentationModelAssembler<SubscriptionEntry, SubscriptionEntryGetResponse> assembler;
  private final SubscriptionEntryRepository subscriptionEntryRepository;

  public SubscriptionEntryCollectionResource(
    RepresentationModelAssembler<SubscriptionEntry, SubscriptionEntryGetResponse> assembler,
    SubscriptionEntryRepository subscriptionEntryRepository
  ) {
    this.assembler = assembler;
    this.subscriptionEntryRepository = subscriptionEntryRepository;
  }

  @GetMapping(SUBSCRIPTION_ENTRIES)
  public PagedModel<SubscriptionEntryGetResponse> get(SearchRequest searchRequest) {
    var slicedEntries = subscriptionEntryRepository.findBy(
      searchRequest.getSize(),
      searchRequest.getQ(),
      searchRequest.getFeedUuidEqual(),
      searchRequest.getFeedTagEqual(),
      searchRequest.getEntryTagEqual(),
      searchRequest.getSeenEqual(),
      searchRequest.getNext()
    ).map(assembler::toModel);

    var builder = ServletUriComponentsBuilder.fromCurrentRequest().replaceQueryParam("next", Collections.emptyList());
    List<Link> links = new ArrayList<>();
    links.add(Link.of(builder.toUriString(), IanaLinkRelations.SELF));

    if (slicedEntries.hasNext()) {
      var last = slicedEntries.getContent().get(slicedEntries.getSize() - 1);
      links.add(Link.of(builder.queryParam("next", last.getUuid()).toUriString(), IanaLinkRelations.NEXT));
    }

    return PagedModel.of(slicedEntries.getContent(), null, links);
  }

  @GetMapping(SUBSCRIPTION_ENTRIES_AVAILABLE_TAGS)
  public Set<String> tags() {
    return subscriptionEntryRepository.findDistinctTags();
  }
}
