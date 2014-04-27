package myreader.resource.subscription;

import myreader.entity.Subscription;
import myreader.resource.subscription.beans.SubscriptionGetResponse;
import myreader.resource.subscription.beans.SubscriptionPostRequest;
import myreader.resource.subscription.converter.SubscriptionGetResponseConverter;
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
    private final SubscriptionGetResponseConverter subscriptionConverter = new SubscriptionGetResponseConverter();
    private final SubscriptionEntryCollectionResource subscriptionEntryResourceController;
    private final PagedResourcesAssembler pagedResourcesAssembler;

    @Autowired
    public SubscriptionCollectionResource(SubscriptionService subscriptionService, SubscriptionEntryCollectionResource subscriptionEntryResourceController, PagedResourcesAssembler pagedResourcesAssembler) {
        this.subscriptionService = subscriptionService;
        this.subscriptionEntryResourceController = subscriptionEntryResourceController;
        this.pagedResourcesAssembler = pagedResourcesAssembler;
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    public void post(@Valid @RequestBody SubscriptionPostRequest bean) {

        subscriptionService.subscribe(bean.getUrl());

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

        List<SubscriptionGetResponse> dtos = subscriptionConverter.toDto(subscriptionPage.getContent());
        Page<SubscriptionGetResponse> pagedDtos = new PageImpl<SubscriptionGetResponse>(dtos, pageable, subscriptionPage.getTotalElements());

        PagedResources pagedResources = pagedResourcesAssembler.toResource(pagedDtos);

       // pagedResources.add(new Link("http://search", "search"));
        return pagedResources;

    }
}
