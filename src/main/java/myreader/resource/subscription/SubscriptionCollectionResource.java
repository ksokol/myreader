package myreader.resource.subscription;

import myreader.entity.Subscription;
import myreader.resource.subscription.beans.SubscriptionGetResponse;
import myreader.resource.subscription.beans.SubscriptionPostRequest;
import myreader.resource.subscription.converter.SubscriptionGetResponseAssembler;
import myreader.resource.subscriptionentry.SubscriptionEntryCollectionResource;
import myreader.service.subscription.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.ExposesResourceFor;
import org.springframework.hateoas.PagedResources;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * @author Kamill Sokol
 */
@ExposesResourceFor(SubscriptionGetResponse.class)
@Controller
@RequestMapping(value = "/subscriptions", produces = MediaType.APPLICATION_JSON_VALUE)
public class SubscriptionCollectionResource {

    private final SubscriptionService subscriptionService;
    private final SubscriptionGetResponseAssembler subscriptionAssembler = new SubscriptionGetResponseAssembler();
    private final SubscriptionEntryCollectionResource subscriptionEntryResourceController;
    private final PagedResourcesAssembler pagedResourcesAssembler;

    @Autowired
    public SubscriptionCollectionResource(SubscriptionService subscriptionService, SubscriptionEntryCollectionResource subscriptionEntryResourceController, PagedResourcesAssembler pagedResourcesAssembler) {
        this.subscriptionService = subscriptionService;
        this.subscriptionEntryResourceController = subscriptionEntryResourceController;
        this.pagedResourcesAssembler = pagedResourcesAssembler;
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    @ResponseBody
    public SubscriptionGetResponse post(@Valid @RequestBody SubscriptionPostRequest bean) {
        Subscription subscription = subscriptionService.subscribe(bean.getUrl());
        SubscriptionGetResponse subscriptionGetResponse = subscriptionAssembler.toDto(subscription);
        return subscriptionGetResponse;
    }

// @CurrentUser MyReaderUser user,
    @RequestMapping(value = "/{id}/entries", method = RequestMethod.GET)
    @ResponseBody
    public PagedResources getSubscriptionEntries(@PathVariable("id") Long id,  Pageable pageable) {
        //Page<SubscriptionEntryResourceBean>
        return subscriptionEntryResourceController.findBySubscription(id, pageable);
    }

    @ResponseBody
    @RequestMapping(value="", method = RequestMethod.GET)
    public PagedResources get(Pageable pageable) {
        Page<Subscription> subscriptionPage = subscriptionService.findAll(pageable);

        List<SubscriptionGetResponse> dtos = subscriptionAssembler.toDto(subscriptionPage.getContent());
        Page<SubscriptionGetResponse> pagedDtos = new PageImpl<SubscriptionGetResponse>(dtos, pageable, subscriptionPage.getTotalElements());

        PagedResources pagedResources = pagedResourcesAssembler.toResource(pagedDtos);

       // pagedResources.add(new Link("http://search", "search"));
        return pagedResources;

    }
}
