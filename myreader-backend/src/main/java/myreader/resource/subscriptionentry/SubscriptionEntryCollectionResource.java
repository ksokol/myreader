package myreader.resource.subscriptionentry;

import myreader.entity.SubscriptionEntry;
import myreader.repository.SubscriptionEntryRepository;
import myreader.resource.subscriptionentry.beans.SearchRequest;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryBatchPatchRequest;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryPatchRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.PagedModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static org.springframework.web.util.UriComponentsBuilder.fromUriString;

/**
 * @author Kamill Sokol
 */
@RestController
@RequestMapping(value = "api/2/subscriptionEntries")
public class SubscriptionEntryCollectionResource {

    private final PagedResourcesAssembler<SubscriptionEntry> pagedResourcesAssembler;
    private final RepresentationModelAssembler<SubscriptionEntry, SubscriptionEntryGetResponse> assembler;
    private final SubscriptionEntryRepository subscriptionEntryRepository;

    public SubscriptionEntryCollectionResource(
            PagedResourcesAssembler<SubscriptionEntry> pagedResourcesAssembler,
            RepresentationModelAssembler<SubscriptionEntry, SubscriptionEntryGetResponse> assembler,
            SubscriptionEntryRepository subscriptionEntryRepository
    ) {
        this.pagedResourcesAssembler = pagedResourcesAssembler;
        this.assembler = assembler;
        this.subscriptionEntryRepository = subscriptionEntryRepository;
    }

    @GetMapping
    public PagedModel<SubscriptionEntryGetResponse> get(Pageable pageRequest, SearchRequest page) {
        Page<SubscriptionEntry> pagedEntries = subscriptionEntryRepository.findByForCurrentUser(
                pageRequest,
                page.getQ(),
                page.getFeedUuidEqual(),
                page.getFeedTagEqual(),
                page.getEntryTagEqual(),
                page.getSeenEqual(),
                page.getStamp()
        );

        PagedModel<SubscriptionEntryGetResponse> pagedModel = pagedResourcesAssembler.toModel(pagedEntries, assembler);

        List<Link> links = pagedModel.getLinks()
                .stream()
                .map(link -> link.withHref(fromUriString(link.getHref()).queryParam("stamp", page.getStamp()).toUriString()))
                .collect(Collectors.toList());

        pagedModel.removeLinks();
        pagedModel.add(links);

        return pagedModel;
    }

    @GetMapping("availableTags")
    public Set<String> tags() {
        return subscriptionEntryRepository.findDistinctTagsForCurrentUser();
    }

    @Transactional
    @PatchMapping
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

        return new CollectionModel<>(subscriptionEntryGetResponses);
    }
}
