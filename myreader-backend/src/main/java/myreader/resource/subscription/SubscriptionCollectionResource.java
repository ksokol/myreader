package myreader.resource.subscription;

import myreader.entity.Subscription;
import myreader.repository.SubscriptionRepository;
import myreader.resource.ResourceConstants;
import myreader.resource.subscription.beans.SubscribePostRequest;
import myreader.resource.subscription.beans.SubscribePostRequestValidator;
import myreader.resource.subscription.beans.SubscriptionGetResponse;
import myreader.security.AuthenticatedUser;
import myreader.service.feed.FeedService;
import myreader.service.subscription.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author Kamill Sokol
 */
@RestController
public class SubscriptionCollectionResource {

    private final SubscriptionService subscriptionService;
    private final SubscriptionRepository subscriptionRepository;
    private final FeedService feedService;
    private final RepresentationModelAssembler<Subscription, SubscriptionGetResponse> assembler;

    @Autowired
    public SubscriptionCollectionResource(
            RepresentationModelAssembler<Subscription, SubscriptionGetResponse> assembler,
            SubscriptionService subscriptionService,
            SubscriptionRepository subscriptionRepository,
            FeedService feedService
    ) {
        this.assembler = assembler;
        this.subscriptionService = subscriptionService;
        this.subscriptionRepository = subscriptionRepository;
        this.feedService = feedService;
    }

    @InitBinder
    protected void binder(
            WebDataBinder binder,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser
    ) {
        binder.addValidators(new SubscribePostRequestValidator(subscriptionRepository, feedService, authenticatedUser));
    }

    @PostMapping(ResourceConstants.SUBSCRIPTIONS)
    public SubscriptionGetResponse post(
            @Validated @RequestBody SubscribePostRequest request,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser
    ) {
        Subscription subscription = subscriptionService.subscribe(authenticatedUser.getUsername(), request.getOrigin());
        return assembler.toModel(subscription);
    }

    @GetMapping(ResourceConstants.SUBSCRIPTIONS)
    public Map<String, Object> get(
            @RequestParam(value = "unseenGreaterThan", required = false, defaultValue = "-1") long unseenCount,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser
    ) {
        List<Subscription> source = subscriptionRepository.findAllByUnseenGreaterThanAndUserId(unseenCount, authenticatedUser.getId());
        List<SubscriptionGetResponse> target = new ArrayList<>(source.size());
        for (final Subscription subscription : source) {
            target.add(assembler.toModel(subscription));
        }
        HashMap<String, Object> body = new HashMap<>(2);
        body.put("content", target);
        return body;
    }
}
