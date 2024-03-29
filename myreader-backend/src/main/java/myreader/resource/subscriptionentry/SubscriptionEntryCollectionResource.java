package myreader.resource.subscriptionentry;

import jakarta.servlet.http.HttpServletRequest;
import myreader.repository.SubscriptionEntryRepository;
import myreader.resource.subscriptionentry.converter.SubscriptionEntryGetResponseConverter;
import org.springframework.web.bind.ServletRequestBindingException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.regex.Pattern;

import static myreader.resource.ResourceConstants.SUBSCRIPTION_ENTRIES;

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
  public Map<String, Object> get(HttpServletRequest httpServletRequest) throws ServletRequestBindingException {
    var slicedEntries = subscriptionEntryRepository.findBy(
      httpServletRequest.getParameter("feedUuidEqual"),
      httpServletRequest.getParameter("feedTagEqual"),
      getSeenEqual(httpServletRequest),
      getUUid(httpServletRequest)
    ).map(assembler::toModel);

    var nextPage = new TreeMap<>();
    Map<String, Object> response = new TreeMap<>();

    if (slicedEntries.hasNext()) {
      var builder = ServletUriComponentsBuilder
        .fromCurrentRequest()
        .replaceQueryParam("uuid", List.of());
      var last = slicedEntries.getContent().get(slicedEntries.getSize() - 1);

      nextPage.put("uuid", last.getUuid());

      for (Map.Entry<String, List<String>> entry : builder.build().getQueryParams().entrySet()) {
        entry.getValue().stream()
          .findFirst()
          .ifPresent(value -> nextPage.put(entry.getKey(), value));
      }
      response.put("nextPage", nextPage);
    }

    response.put("content", slicedEntries.getContent());

    return response;
  }

  private static Boolean getSeenEqual(HttpServletRequest httpServletRequest) {
    var seenEqual = httpServletRequest.getParameter("seenEqual");
    if ("true".equalsIgnoreCase(seenEqual) || "false".equalsIgnoreCase(seenEqual)) {
      return Boolean.parseBoolean(seenEqual);
    }
    return null;
  }

  private static final Pattern pattern = Pattern.compile("\\d+");

  private static Long getUUid(HttpServletRequest httpServletRequest) {
    var uuidParam = httpServletRequest.getParameter("uuid");
    if (uuidParam != null && pattern.matcher(uuidParam).matches()) {
      return Long.parseLong(uuidParam);
    }
    return null;
  }
}
