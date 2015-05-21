package myreader.resource.subscriptionentry;

import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.PATCH;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionService;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import myreader.entity.SubscriptionEntry;
import myreader.repository.SubscriptionEntryRepository;
import myreader.repository.SubscriptionRepository;
import myreader.resource.common.Content;
import myreader.resource.exception.ResourceNotFoundException;
import myreader.resource.service.patch.PatchService;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryPatchRequest;
import spring.security.MyReaderUser;

/**
 * @author Kamill Sokol
 */
@Transactional
@RestController
@RequestMapping("subscriptionEntries/{id}")
public class SubscriptionEntryEntityResource {

    private final ConversionService conversionService;
    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionEntryRepository subscriptionEntryRepository;
    private final PatchService patchService;

    @Autowired
    public SubscriptionEntryEntityResource(final ConversionService conversionService, final SubscriptionRepository subscriptionRepository, final SubscriptionEntryRepository subscriptionEntryRepository, final PatchService patchService) {
        this.conversionService = conversionService;
        this.subscriptionRepository = subscriptionRepository;
        this.subscriptionEntryRepository = subscriptionEntryRepository;
        this.patchService = patchService;
    }

    @RequestMapping(method = GET)
    public Content<SubscriptionEntryGetResponse> get(@PathVariable("id") Long id, @AuthenticationPrincipal MyReaderUser user) {
        final SubscriptionEntry subscriptionEntry = findOrThrowException(id, user.getUsername());
        final Set<String> distinctTags = subscriptionEntryRepository.findDistinctTags(user.getId());
        final SubscriptionEntryGetResponse subscriptionEntryGetResponse = conversionService.convert(subscriptionEntry, SubscriptionEntryGetResponse.class);
        final Content<SubscriptionEntryGetResponse> body = new Content<>(subscriptionEntryGetResponse);
        body.add("availableTags", distinctTags);
        return body;
    }

    @Transactional
    @RequestMapping(method = PATCH)
    public Content<SubscriptionEntryGetResponse> patch(@PathVariable("id") Long id, @AuthenticationPrincipal MyReaderUser user, @RequestBody Content<SubscriptionEntryPatchRequest> content) {
        final SubscriptionEntry subscriptionEntry = findOrThrowException(id, user.getUsername());
        final SubscriptionEntryPatchRequest patchRequest = content.getContent();

        if(patchRequest.isFieldPatched("seen") && patchRequest.getSeen() != null && patchRequest.getSeen() != subscriptionEntry.isSeen()) {
            if (patchRequest.getSeen()){
                subscriptionRepository.decrementUnseen(subscriptionEntry.getSubscription().getId());
            } else {
                subscriptionRepository.incrementUnseen(subscriptionEntry.getSubscription().getId());
            }
        }

        SubscriptionEntry patched = patchService.patch(patchRequest, subscriptionEntry);
        subscriptionEntryRepository.save(patched);

        return get(id, user);
    }

    public SubscriptionEntry findOrThrowException(Long id, String username) {
        SubscriptionEntry entry = subscriptionEntryRepository.findByIdAndUsername(id, username);
        if(entry == null) {
            throw new ResourceNotFoundException();
        }
        return entry;
    }
}
