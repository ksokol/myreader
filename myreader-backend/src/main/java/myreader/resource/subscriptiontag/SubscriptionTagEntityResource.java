package myreader.resource.subscriptiontag;

import myreader.entity.SubscriptionTag;
import myreader.repository.SubscriptionTagRepository;
import myreader.resource.ResourceConstants;
import myreader.resource.subscriptiontag.beans.SubscriptionTagGetResponse;
import myreader.resource.subscriptiontag.beans.SubscriptionTagPatchRequest;
import myreader.security.AuthenticatedUser;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;

/**
 * @author Kamill Sokol
 */
@RestController
@RequestMapping(ResourceConstants.SUBSCRIPTION_TAGS)
public class SubscriptionTagEntityResource {

    private final SubscriptionTagRepository subscriptionTagRepository;
    private final RepresentationModelAssembler<SubscriptionTag, SubscriptionTagGetResponse> assembler;

    public SubscriptionTagEntityResource(
            SubscriptionTagRepository subscriptionTagRepository,
            RepresentationModelAssembler<SubscriptionTag,
            SubscriptionTagGetResponse> assembler
    ) {
        this.subscriptionTagRepository = subscriptionTagRepository;
        this.assembler = assembler;
    }

    @PatchMapping
    public SubscriptionTagGetResponse patch(
            @PathVariable("id") Long id,
            @Valid @RequestBody SubscriptionTagPatchRequest request,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser
    ) {
        SubscriptionTag subscriptionTag = subscriptionTagRepository
                .findByIdAndUserId(id, authenticatedUser.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        subscriptionTag.setName(request.getName());
        subscriptionTag.setColor(request.getColor());

        return assembler.toModel(subscriptionTagRepository.save(subscriptionTag));
    }
}
