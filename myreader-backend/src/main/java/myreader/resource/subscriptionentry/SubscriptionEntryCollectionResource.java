package myreader.resource.subscriptionentry;

import myreader.repository.SubscriptionEntryRepository;
import myreader.resource.subscriptionentry.beans.SearchRequest;
import myreader.resource.subscriptionentry.converter.SubscriptionEntryGetResponseConverter;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

import static myreader.resource.ResourceConstants.SUBSCRIPTION_ENTRIES;
import static myreader.resource.ResourceConstants.SUBSCRIPTION_ENTRIES_AVAILABLE_TAGS;

@RestController
public class SubscriptionEntryCollectionResource {

  private final SubscriptionEntryGetResponseConverter assembler;
  private final SubscriptionEntryRepository subscriptionEntryRepository;

  public SubscriptionEntryCollectionResource(
    SubscriptionEntryGetResponseConverter assembler,
    SubscriptionEntryRepository subscriptionEntryRepository
  ) {
    this.assembler = assembler;
    this.subscriptionEntryRepository = subscriptionEntryRepository;
  }

  @GetMapping(SUBSCRIPTION_ENTRIES)
  public Map<String, Object> get(SearchRequest searchRequest) {
    var slicedEntries = subscriptionEntryRepository.findBy(
      searchRequest.getFeedUuidEqual(),
      searchRequest.getFeedTagEqual(),
      searchRequest.getEntryTagEqual(),
      searchRequest.getSeenEqual(),
      searchRequest.getNext()
    ).map(assembler::toModel);

    var builder = ServletUriComponentsBuilder
      .fromCurrentRequest()
      .replaceQueryParam("next", List.of());

    String nextUrl = null;

    if (slicedEntries.hasNext()) {
      var last = slicedEntries.getContent().get(slicedEntries.getSize() - 1);
      nextUrl = builder.queryParam("next", last.getUuid()).toUriString();
    }

    Map<String, Object> response = new TreeMap<>();
    response.put("next", nextUrl);
    response.put("content", slicedEntries.getContent());

    return response;
  }

  @GetMapping(SUBSCRIPTION_ENTRIES_AVAILABLE_TAGS)
  public Set<String> tags() {
    return subscriptionEntryRepository.findDistinctTags();
  }
}
