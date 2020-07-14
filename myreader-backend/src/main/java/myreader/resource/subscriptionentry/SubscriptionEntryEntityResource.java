package myreader.resource.subscriptionentry;

import myreader.entity.SubscriptionEntry;
import myreader.repository.SubscriptionEntryRepository;
import myreader.resource.ResourceConstants;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryPatchRequest;
import myreader.security.AuthenticatedUser;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * @author Kamill Sokol
 */
@RestController
@RequestMapping(ResourceConstants.SUBSCRIPTION_ENTRY)
public class SubscriptionEntryEntityResource {

    private final SubscriptionEntryRepository subscriptionEntryRepository;
    private final RepresentationModelAssembler<SubscriptionEntry, SubscriptionEntryGetResponse> assembler;

    public SubscriptionEntryEntityResource(
            RepresentationModelAssembler<SubscriptionEntry, SubscriptionEntryGetResponse> assembler,
            SubscriptionEntryRepository subscriptionEntryRepository
    ) {
        this.assembler = assembler;
        this.subscriptionEntryRepository = subscriptionEntryRepository;
    }

    @GetMapping
    public SubscriptionEntryGetResponse get(@PathVariable("id") Long id, @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        SubscriptionEntry subscriptionEntry = subscriptionEntryRepository.findByIdAndUserId(id, authenticatedUser.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return assembler.toModel(subscriptionEntry);
    }

    @PatchMapping
    public SubscriptionEntryGetResponse patch(
            @PathVariable("id") Long id,
            @RequestBody SubscriptionEntryPatchRequest request,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser
    ) {
        SubscriptionEntry subscriptionEntry = subscriptionEntryRepository.findByIdAndUserId(id, authenticatedUser.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (request.getSeen() != null) {
            subscriptionEntry.setSeen(request.getSeen());
        }

        subscriptionEntry.setTags(request.getTags());

        subscriptionEntryRepository.save(subscriptionEntry);

        return get(id, authenticatedUser);
    }
}
