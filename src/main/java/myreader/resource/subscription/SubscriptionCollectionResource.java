package myreader.resource.subscription;

import myreader.entity.Subscription;
import myreader.repository.SubscriptionRepository;
import myreader.resource.RestControllerSupport;
import myreader.resource.subscription.beans.SubscribePostRequest;
import myreader.resource.subscription.beans.SubscriptionGetResponse;
import myreader.service.subscription.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.PagedResources;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import spring.hateoas.ResourceAssemblers;
import spring.security.MyReaderUser;

import javax.validation.Valid;

/**
 * @author Kamill Sokol
 */
@RestController
@RequestMapping(value = "/subscriptions")
public class SubscriptionCollectionResource extends RestControllerSupport {

	private final SubscriptionService subscriptionService;
    private final SubscriptionRepository subscriptionRepository;

    @Autowired
    public SubscriptionCollectionResource(SubscriptionService subscriptionService, SubscriptionRepository subscriptionRepository, ResourceAssemblers resourceAssemblers) {
        super(resourceAssemblers);
        this.subscriptionService = subscriptionService;
        this.subscriptionRepository = subscriptionRepository;
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    public SubscriptionGetResponse post(@Valid @RequestBody SubscribePostRequest request, @AuthenticationPrincipal MyReaderUser user) {
        Subscription subscription = subscriptionService.subscribe(user.getId(), request.getUrl());
        return resourceAssemblers.toResource(subscription, SubscriptionGetResponse.class);
    }

    @RequestMapping(value="", method = RequestMethod.GET)
    public PagedResources<SubscriptionGetResponse> get(Pageable pageable, @AuthenticationPrincipal MyReaderUser user) {
        Page<Subscription> subscriptionPage = subscriptionRepository.findAllByUser(user.getId(), pageable);
        return resourceAssemblers.toResource(subscriptionPage, SubscriptionGetResponse.class);
    }

}
