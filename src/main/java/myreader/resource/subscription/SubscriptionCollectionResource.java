package myreader.resource.subscription;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import myreader.entity.Subscription;
import myreader.repository.SubscriptionRepository;
import myreader.resource.subscription.beans.SubscribePostRequest;
import myreader.resource.subscription.beans.SubscriptionGetResponse;
import myreader.service.subscription.SubscriptionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import spring.hateoas.ResourceAssemblers;
import spring.security.MyReaderUser;

/**
 * @author Kamill Sokol
 */
@RestController
@RequestMapping(value = "/subscriptions")
public class SubscriptionCollectionResource {

    private final ResourceAssemblers resourceAssemblers;
	private final SubscriptionService subscriptionService;
    private final SubscriptionRepository subscriptionRepository;

    @Autowired
    public SubscriptionCollectionResource(final ResourceAssemblers resourceAssemblers, final SubscriptionService subscriptionService, final SubscriptionRepository subscriptionRepository) {
        this.resourceAssemblers = resourceAssemblers;
        this.subscriptionService = subscriptionService;
        this.subscriptionRepository = subscriptionRepository;
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    public SubscriptionGetResponse post(@Valid @RequestBody SubscribePostRequest request, @AuthenticationPrincipal MyReaderUser user) {
        Subscription subscription = subscriptionService.subscribe(user.getId(), request.getOrigin());
        return resourceAssemblers.toResource(subscription, SubscriptionGetResponse.class);
    }

    @RequestMapping(value = "", method = RequestMethod.GET)
    public Map<String, Object> get(@RequestParam(value = "unseenGreaterThan", required = false, defaultValue = "-1") int unseenCount, @AuthenticationPrincipal MyReaderUser user) {
        final List<Subscription> source = subscriptionRepository.findAllByUserAndUnseenGreaterThan(user.getId(), unseenCount);
        final List<SubscriptionGetResponse> target = new ArrayList<>(source.size());
        for (final Subscription subscription : source) {
            target.add(resourceAssemblers.toResource(subscription, SubscriptionGetResponse.class));
        }
        final HashMap<String, Object> body = new HashMap<>(2);
        body.put("content", target);
        return body;
    }

    @RequestMapping(value= "availableTags", method = GET)
    public List<String> tags(@AuthenticationPrincipal MyReaderUser user) {
        return subscriptionRepository.findDistinctTags(user.getId());
    }

}
