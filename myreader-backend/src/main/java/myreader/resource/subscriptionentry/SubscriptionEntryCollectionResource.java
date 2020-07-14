package myreader.resource.subscriptionentry;

import myreader.entity.SubscriptionEntry;
import myreader.repository.SubscriptionEntryRepository;
import myreader.resource.subscriptionentry.beans.SearchRequest;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryBatchPatchRequest;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryBatchPatchRequestValidator;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryPatchRequest;
import org.springframework.data.domain.Slice;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.PagedModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.util.UriComponentsBuilder;
import myreader.security.AuthenticatedUser;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static myreader.resource.ResourceConstants.SUBSCRIPTION_ENTRIES;
import static myreader.resource.ResourceConstants.SUBSCRIPTION_ENTRIES_AVAILABLE_TAGS;

/**
 * @author Kamill Sokol
 */
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

    @InitBinder
    protected void binder(WebDataBinder binder) {
        binder.addValidators(new SubscriptionEntryBatchPatchRequestValidator());
    }

    @GetMapping(SUBSCRIPTION_ENTRIES)
    public PagedModel<SubscriptionEntryGetResponse> get(
            SearchRequest searchRequest,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser
    ) {
        Slice<SubscriptionEntryGetResponse> slicedEntries = subscriptionEntryRepository.findBy(
                searchRequest.getSize(),
                searchRequest.getQ(),
                searchRequest.getFeedUuidEqual(),
                searchRequest.getFeedTagEqual(),
                searchRequest.getEntryTagEqual(),
                searchRequest.getSeenEqual(),
                searchRequest.getNext(),
                authenticatedUser.getId()
        ).map(assembler::toModel);

        UriComponentsBuilder builder = ServletUriComponentsBuilder.fromCurrentRequest().replaceQueryParam("next", Collections.emptyList());
        List<Link> links = new ArrayList<>();
        links.add(Link.of(builder.toUriString(), IanaLinkRelations.SELF));

        if (slicedEntries.hasNext()) {
            SubscriptionEntryGetResponse last = slicedEntries.getContent().get(slicedEntries.getSize() - 1);
            links.add(Link.of(builder.queryParam("next", last.getUuid()).toUriString(), IanaLinkRelations.NEXT));
        }

        return PagedModel.of(slicedEntries.getContent(), null, links);
    }

    @GetMapping(SUBSCRIPTION_ENTRIES_AVAILABLE_TAGS)
    public Set<String> tags(@AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        return subscriptionEntryRepository.findDistinctTagsByUserId(authenticatedUser.getId());
    }

    @Transactional
    @PatchMapping(SUBSCRIPTION_ENTRIES)
    public CollectionModel<SubscriptionEntryGetResponse> patch(
            @Validated @RequestBody SubscriptionEntryBatchPatchRequest request,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser
    ) {
        List<SubscriptionEntryGetResponse> subscriptionEntryGetResponses = new ArrayList<>(request.getContent().size());

        for (SubscriptionEntryPatchRequest subscriptionPatch : request.getContent()) {
            Optional<SubscriptionEntry> optional = subscriptionEntryRepository.findByIdAndUserId(
                    Long.valueOf(subscriptionPatch.getUuid()),
                    authenticatedUser.getId()
            );
            if (!optional.isPresent()) {
                continue;
            }

            SubscriptionEntry subscriptionEntry = optional.get();

            if (subscriptionPatch.getSeen() != null) {
                subscriptionEntry.setSeen(subscriptionPatch.getSeen());
            }
            subscriptionEntry.setTags(subscriptionPatch.getTags());

            SubscriptionEntry saved = subscriptionEntryRepository.save(subscriptionEntry);
            SubscriptionEntryGetResponse subscriptionEntryGetResponse = assembler.toModel(saved);
            subscriptionEntryGetResponses.add(subscriptionEntryGetResponse);
        }

        return CollectionModel.of(subscriptionEntryGetResponses);
    }
}
