package myreader.resource.subscriptionentry;

import myreader.repository.SubscriptionEntryRepository;
import myreader.resource.ResourceConstants;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryPatchRequest;
import myreader.resource.subscriptionentry.converter.SubscriptionEntryGetResponseConverter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping(ResourceConstants.SUBSCRIPTION_ENTRY)
public class SubscriptionEntryEntityResource {

  private final SubscriptionEntryRepository subscriptionEntryRepository;
  private final SubscriptionEntryGetResponseConverter assembler;

  public SubscriptionEntryEntityResource(
    SubscriptionEntryGetResponseConverter assembler,
    SubscriptionEntryRepository subscriptionEntryRepository
  ) {
    this.assembler = assembler;
    this.subscriptionEntryRepository = subscriptionEntryRepository;
  }

  @PatchMapping
  public SubscriptionEntryGetResponse patch(
    @PathVariable("id") Long id,
    @RequestBody SubscriptionEntryPatchRequest request
  ) {
    var subscriptionEntry = subscriptionEntryRepository
      .findById(id)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

    if (request.getSeen() != null) {
      subscriptionEntry.setSeen(request.getSeen());
    }

    subscriptionEntry = subscriptionEntryRepository.save(subscriptionEntry);

    return assembler.toModel(subscriptionEntry);
  }
}
