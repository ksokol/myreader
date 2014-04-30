package myreader.resource.subscription;

import myreader.entity.Subscription;
import myreader.repository.SubscriptionRepository;
import myreader.resource.exception.ResourceNotFoundException;
import myreader.resource.subscription.assembler.SubscriptionGetResponseAssembler;
import myreader.resource.subscription.beans.SubscriptionGetResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.ExposesResourceFor;
import org.springframework.http.HttpStatus;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import spring.security.MyReaderUser;

/**
 * @author Kamill Sokol
 */
@ExposesResourceFor(SubscriptionGetResponse.class)
@Controller
@RequestMapping("subscriptions")
public class SubscriptionEntityResource {

    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionGetResponseAssembler subscriptionAssembler = new SubscriptionGetResponseAssembler(SubscriptionEntityResource.class);

    @Autowired
    public SubscriptionEntityResource(SubscriptionRepository subscriptionService) {
        this.subscriptionRepository = subscriptionService;
    }

    @ModelAttribute
    public Subscription find(@PathVariable("id") Long id, @AuthenticationPrincipal MyReaderUser user) {
        Subscription subscription = subscriptionRepository.findByIdAndUsername(id, user.getUsername());
        if(subscription == null) {
            throw new ResourceNotFoundException();
        }
        return subscription;
    }

    @RequestMapping(value = "{id}", method = RequestMethod.GET)
    @ResponseBody
    public SubscriptionGetResponse get(Subscription s) {
        return subscriptionAssembler.toResource(s);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @RequestMapping(value = "{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public void delete(Subscription s) {
        subscriptionRepository.delete(s.getId());
    }

//    @RequestMapping(value = "{id}", method = RequestMethod.PATCH)
//    public void patch(@RequestBody SubscriptionGetResponse bean,  Subscription s) {
//
//        s.setTag(bean.getTag());
//        s.setTitle(bean.getTitle());
//
//        subscriptionRepository.save(s);
//
//    }
}
