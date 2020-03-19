package myreader.resource.subscriptionentry;

import myreader.entity.SubscriptionEntry;
import myreader.repository.SubscriptionEntryRepository;
import myreader.resource.exception.ResourceNotFoundException;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryPatchRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.PATCH;

/**
 * @author Kamill Sokol
 */
@Transactional
@RestController
@RequestMapping("api/2/subscriptionEntries/{id}")
public class SubscriptionEntryEntityResource {

    private final SubscriptionEntryRepository subscriptionEntryRepository;
    private final RepresentationModelAssembler<SubscriptionEntry, SubscriptionEntryGetResponse> assembler;

    @Autowired
    public SubscriptionEntryEntityResource(
            RepresentationModelAssembler<SubscriptionEntry, SubscriptionEntryGetResponse> assembler,
            SubscriptionEntryRepository subscriptionEntryRepository
    ) {
        this.assembler = assembler;
        this.subscriptionEntryRepository = subscriptionEntryRepository;
    }

    @RequestMapping(method = GET)
    public SubscriptionEntryGetResponse get(@PathVariable("id") Long id) {
        final SubscriptionEntry subscriptionEntry = findOrThrowException(id);
        return assembler.toModel(subscriptionEntry);
    }

    @RequestMapping(method = PATCH)
    public SubscriptionEntryGetResponse patch(@PathVariable("id") Long id, @RequestBody SubscriptionEntryPatchRequest request) {
        final SubscriptionEntry subscriptionEntry = findOrThrowException(id);

        if(request.getSeen() != null) {
            subscriptionEntry.setSeen(request.getSeen());
        }

        subscriptionEntry.setTag(request.getTag());

        subscriptionEntryRepository.save(subscriptionEntry);

        return get(id);
    }

    private SubscriptionEntry findOrThrowException(Long id) {
        SubscriptionEntry entry = subscriptionEntryRepository.findByIdAndCurrentUser(id);
        if(entry == null) {
            throw new ResourceNotFoundException();
        }
        return entry;
    }
}
