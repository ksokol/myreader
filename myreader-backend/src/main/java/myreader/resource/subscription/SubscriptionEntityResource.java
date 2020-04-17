package myreader.resource.subscription;

import myreader.entity.Subscription;
import myreader.entity.SubscriptionTag;
import myreader.repository.SubscriptionRepository;
import myreader.repository.SubscriptionTagRepository;
import myreader.resource.ResourceConstants;
import myreader.resource.subscription.beans.SubscriptionGetResponse;
import myreader.resource.subscription.beans.SubscriptionPatchRequest;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;

/**
 * @author Kamill Sokol
 */
@Transactional
@RestController
@RequestMapping(ResourceConstants.SUBSCRIPTION)
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

    @GetMapping
    public SubscriptionGetResponse get(@PathVariable("id") Long id) {
        Subscription subscription = findOrThrowException(id);
        return assembler.toModel(subscription);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping
    public void delete(@PathVariable("id") Long id) {
        subscriptionRepository.delete(findOrThrowException(id));
    }

    @Transactional
    @PatchMapping
    public SubscriptionGetResponse patch(@PathVariable("id") Long id, @Valid @RequestBody SubscriptionPatchRequest request) {
        Subscription subscription = findOrThrowException(id);
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

        return get(id);
    }

    private Subscription findOrThrowException(Long id) {
        Subscription subscription = subscriptionRepository.findByIdAndCurrentUser(id);
        if (subscription == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return subscription;
    }
}
