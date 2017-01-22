package myreader.resource.subscriptionentry;

import myreader.entity.SubscriptionEntry;
import myreader.repository.SubscriptionEntryRepository;
import myreader.resource.subscriptionentry.beans.SearchRequest;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryBatchPatchRequest;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryPatchRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Slice;
import org.springframework.hateoas.PagedResources;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.hateoas.Resources;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

/**
 * @author Kamill Sokol
 */
@RestController
@RequestMapping(value = "api/2/subscriptionEntries")
public class SubscriptionEntryCollectionResource {

    private final ResourceAssembler<SubscriptionEntry, SubscriptionEntryGetResponse> assembler;
    private final SubscriptionEntryRepository subscriptionEntryRepository;

    @Autowired
    public SubscriptionEntryCollectionResource(final ResourceAssembler<SubscriptionEntry, SubscriptionEntryGetResponse> assembler,
                                               final SubscriptionEntryRepository subscriptionEntryRepository) {
        this.assembler = assembler;
        this.subscriptionEntryRepository = subscriptionEntryRepository;
    }

    @RequestMapping(method = GET)
    public PagedResources<SubscriptionEntryGetResponse> get(SearchRequest page) {
        Slice<SubscriptionEntry> pagedEntries = subscriptionEntryRepository.findByForCurrentUser(
                page.getQ(),
                page.getFeedUuidEqual(),
                page.getFeedTagEqual(),
                page.getEntryTagEqual(),
                page.getSeenEqual(),
                page.getNext(),
                page.getSize()
        );

        List<SubscriptionEntryGetResponse> list = new ArrayList<>(pagedEntries.getSize());
        for (SubscriptionEntry pagedEntry : pagedEntries) {
            list.add(assembler.toResource(pagedEntry));
        }

        return SequencedResourcesUtils.toSequencedResources(page.getSize(), list);
    }

    @RequestMapping(value = "availableTags", method = GET)
    public Set<String> tags() {
        return subscriptionEntryRepository.findDistinctTagsForCurrentUser();
    }

    //TODO remove RequestMethod.PUT after Android 2.x phased out
    @Transactional
    @RequestMapping(method = {RequestMethod.PATCH, RequestMethod.PUT})
    public Resources<SubscriptionEntryGetResponse> patch(@Valid @RequestBody SubscriptionEntryBatchPatchRequest request) {
        List<SubscriptionEntryGetResponse> subscriptionEntryGetResponses = new ArrayList<>(request.getContent().size());

        for (final SubscriptionEntryPatchRequest subscriptionPatch : request.getContent()) {
            SubscriptionEntry subscriptionEntry = subscriptionEntryRepository.findByIdAndCurrentUser(Long.valueOf(subscriptionPatch.getUuid()));
            if (subscriptionEntry == null) {
                continue;
            }

            if (subscriptionPatch.getSeen() != null) {
                subscriptionEntry.setSeen(subscriptionPatch.getSeen());
            }
            subscriptionEntry.setTag(subscriptionPatch.getTag());

            SubscriptionEntry saved = subscriptionEntryRepository.save(subscriptionEntry);
            SubscriptionEntryGetResponse subscriptionEntryGetResponse = assembler.toResource(saved);
            subscriptionEntryGetResponses.add(subscriptionEntryGetResponse);
        }

        return new Resources<>(subscriptionEntryGetResponses);
    }
}
