package myreader.resource.subscriptionentry;

import myreader.entity.SubscriptionEntry;
import myreader.repository.SubscriptionEntryRepository;
import myreader.resource.subscriptionentry.beans.SearchRequest;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryBatchPatchRequest;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryPatchRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Slice;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
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

    private final RepresentationModelAssembler<SubscriptionEntry, SubscriptionEntryGetResponse> assembler;
    private final SubscriptionEntryRepository subscriptionEntryRepository;

    @Autowired
    public SubscriptionEntryCollectionResource(
            RepresentationModelAssembler<SubscriptionEntry, SubscriptionEntryGetResponse> assembler,
            SubscriptionEntryRepository subscriptionEntryRepository
    ) {
        this.assembler = assembler;
        this.subscriptionEntryRepository = subscriptionEntryRepository;
    }

    @RequestMapping(method = GET)
    public PagedModel<SubscriptionEntryGetResponse> get(SearchRequest page) {
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
            list.add(assembler.toModel(pagedEntry));
        }

        return SequencedResourcesUtils.toSequencedResources(page.getSize(), list);
    }

    @RequestMapping(value = "availableTags", method = GET)
    public Set<String> tags() {
        return subscriptionEntryRepository.findDistinctTagsForCurrentUser();
    }

    @Transactional
    @RequestMapping(method = RequestMethod.PATCH)
    public CollectionModel<SubscriptionEntryGetResponse> patch(@Valid @RequestBody SubscriptionEntryBatchPatchRequest request) {
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
            SubscriptionEntryGetResponse subscriptionEntryGetResponse = assembler.toModel(saved);
            subscriptionEntryGetResponses.add(subscriptionEntryGetResponse);
        }

        return new CollectionModel<SubscriptionEntryGetResponse>(subscriptionEntryGetResponses);
    }
}
