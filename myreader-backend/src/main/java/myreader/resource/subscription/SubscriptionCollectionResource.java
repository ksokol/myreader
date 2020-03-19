package myreader.resource.subscription;

import myreader.entity.Subscription;
import myreader.repository.SubscriptionRepository;
import myreader.resource.subscription.beans.SubscribePostRequest;
import myreader.resource.subscription.beans.SubscriptionGetResponse;
import myreader.service.subscription.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

/**
 * @author Kamill Sokol
 */
@RestController
@RequestMapping(value = "api/2/subscriptions")
public class SubscriptionCollectionResource {

    private final SubscriptionService subscriptionService;
    private final SubscriptionRepository subscriptionRepository;
    private final RepresentationModelAssembler<Subscription, SubscriptionGetResponse> assembler;

    @Autowired
    public SubscriptionCollectionResource(
            RepresentationModelAssembler<Subscription, SubscriptionGetResponse> assembler,
            SubscriptionService subscriptionService,
            SubscriptionRepository subscriptionRepository
    ) {
        this.assembler = assembler;
        this.subscriptionService = subscriptionService;
        this.subscriptionRepository = subscriptionRepository;
    }

    @RequestMapping(method = POST)
    public SubscriptionGetResponse post(
            @Valid @RequestBody SubscribePostRequest request,
            @AuthenticationPrincipal User user) {
        Subscription subscription = subscriptionService.subscribe(user.getUsername(), request.getOrigin());
        return assembler.toModel(subscription);
    }

    @RequestMapping(method = GET)
    public Map<String, Object> get(
            @RequestParam(value = "unseenGreaterThan", required = false, defaultValue = "-1") long unseenCount) {
        final List<Subscription> source = subscriptionRepository.findAllByUnseenGreaterThanAndCurrentUser(unseenCount);
        final List<SubscriptionGetResponse> target = new ArrayList<>(source.size());
        for (final Subscription subscription : source) {
            target.add(assembler.toModel(subscription));
        }
        final HashMap<String, Object> body = new HashMap<>(2);
        body.put("content", target);
        return body;
    }
}
