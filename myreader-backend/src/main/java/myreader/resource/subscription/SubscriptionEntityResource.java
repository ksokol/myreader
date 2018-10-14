package myreader.resource.subscription;

import myreader.entity.Subscription;
import myreader.entity.SubscriptionTag;
import myreader.repository.SubscriptionRepository;
import myreader.repository.SubscriptionTagRepository;
import myreader.resource.exception.ResourceNotFoundException;
import myreader.resource.subscription.beans.SubscriptionGetResponse;
import myreader.resource.subscription.beans.SubscriptionPatchRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

/**
 * @author Kamill Sokol
 */
@Transactional
@RestController
@RequestMapping(value = "api/2/subscriptions/{id}")
public class SubscriptionEntityResource {

    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionTagRepository subscriptionTagRepository;
    private final ResourceAssembler<Subscription, SubscriptionGetResponse> assembler;

    @Autowired
    public SubscriptionEntityResource(ResourceAssembler<Subscription, SubscriptionGetResponse> assembler,
                                      SubscriptionTagRepository subscriptionTagRepository,
                                      SubscriptionRepository subscriptionRepository) {
        this.assembler = assembler;
        this.subscriptionRepository = subscriptionRepository;
        this.subscriptionTagRepository = subscriptionTagRepository;
    }

    @RequestMapping(value = "", method = RequestMethod.GET)
    public SubscriptionGetResponse get(@PathVariable("id") Long id) {
        Subscription subscription = findOrThrowException(id);
        return assembler.toResource(subscription);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @RequestMapping(value = "", method = RequestMethod.DELETE)
    public void delete(@PathVariable("id") Long id) {
        subscriptionRepository.delete(findOrThrowException(id));
    }

    @Transactional
    @RequestMapping(value = "", method = RequestMethod.PATCH)
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
        if(subscription == null) {
            throw new ResourceNotFoundException();
        }
        return subscription;
    }
}
