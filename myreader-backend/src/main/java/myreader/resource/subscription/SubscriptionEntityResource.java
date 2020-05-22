package myreader.resource.subscription;

import myreader.entity.Subscription;
import myreader.entity.SubscriptionTag;
import myreader.repository.SubscriptionRepository;
import myreader.repository.SubscriptionTagRepository;
import myreader.resource.ResourceConstants;
import myreader.resource.subscription.beans.SubscriptionGetResponse;
import myreader.resource.subscription.beans.SubscriptionPatchRequest;
import myreader.security.AuthenticatedUser;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;

/**
 * @author Kamill Sokol
 */
@RestController
public class SubscriptionEntityResource {

    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionTagRepository subscriptionTagRepository;
    private final RepresentationModelAssembler<Subscription, SubscriptionGetResponse> assembler;

    public SubscriptionEntityResource(
            RepresentationModelAssembler<Subscription, SubscriptionGetResponse> assembler,
            SubscriptionTagRepository subscriptionTagRepository,
            SubscriptionRepository subscriptionRepository
    ) {
        this.assembler = assembler;
        this.subscriptionRepository = subscriptionRepository;
        this.subscriptionTagRepository = subscriptionTagRepository;
    }

    @GetMapping(ResourceConstants.SUBSCRIPTION)
    public SubscriptionGetResponse get(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser
    ) {
        return subscriptionRepository
                .findByIdAndUserId(id, authenticatedUser.getId())
                .map(assembler::toModel)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping(ResourceConstants.SUBSCRIPTION)
    public void delete(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser
    ) {
        Subscription subscription = subscriptionRepository
                .findByIdAndUserId(id, authenticatedUser.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        subscriptionRepository.delete(subscription);
    }

    @Transactional
    @PatchMapping(ResourceConstants.SUBSCRIPTION)
    public SubscriptionGetResponse patch(
            @PathVariable("id") Long id,
            @Valid @RequestBody SubscriptionPatchRequest request,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser
    ) {
        Subscription subscription = subscriptionRepository
                .findByIdAndUserId(id, authenticatedUser.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        SubscriptionTag subscriptionTag = null;

        subscription.setTitle(request.getTitle());

        if (request.getFeedTag() != null) {
            SubscriptionPatchRequest.FeedTag feedTag = request.getFeedTag();
            String name = feedTag.getName();

            subscriptionTag = subscriptionTagRepository
                    .findByCurrentUserAndTag(name)
                    .orElse(new SubscriptionTag(name, subscription.getUser()));

            subscriptionTag.setColor(feedTag.getColor());

            subscriptionTagRepository.save(subscriptionTag);
        }

        subscription.setSubscriptionTag(subscriptionTag);
        subscriptionRepository.save(subscription);

        return get(id, authenticatedUser);
    }
}
