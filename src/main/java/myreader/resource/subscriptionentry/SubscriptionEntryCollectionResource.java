package myreader.resource.subscriptionentry;

import myreader.entity.SubscriptionEntry;
import myreader.repository.SubscriptionEntryRepository;
import myreader.resource.subscriptionentry.assembler.SubscriptionEntryGetResponseAssembler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.http.MediaType;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import spring.security.MyReaderUser;

/**
 * @author Kamill Sokol
 */
@Controller
@RequestMapping(value = "subscriptionEntries", produces = MediaType.APPLICATION_JSON_VALUE)
public class SubscriptionEntryCollectionResource {

    private final SubscriptionEntryRepository subscriptionEntryRepository;
    private final PagedResourcesAssembler pagedResourcesAssembler;
    private final SubscriptionEntryGetResponseAssembler preAssembler = new SubscriptionEntryGetResponseAssembler(SubscriptionEntryCollectionResource.class);

    @Autowired
    public SubscriptionEntryCollectionResource(SubscriptionEntryRepository subscriptionEntryRepository, PagedResourcesAssembler pagedResourcesAssembler) {
        this.subscriptionEntryRepository = subscriptionEntryRepository;
        this.pagedResourcesAssembler = pagedResourcesAssembler;
    }

    @ResponseBody
    @RequestMapping(value = "", method = RequestMethod.GET)
    public PagedResources<Page<SubscriptionEntry>> get(Pageable pageable, @AuthenticationPrincipal MyReaderUser user) {
        Page<SubscriptionEntry> pagedEntries = subscriptionEntryRepository.findAllByUser(pageable, user.getId());
        return pagedResourcesAssembler.toResource(pagedEntries, preAssembler);
    }

    @ResponseBody
    @RequestMapping(value = "search/findBySubscription/{id}", method = RequestMethod.GET)
    public PagedResources<Page<SubscriptionEntry>> findBySubscription(@PathVariable("id") Long id, Pageable pageable, @AuthenticationPrincipal MyReaderUser user) {
        Page<SubscriptionEntry> page = subscriptionEntryRepository.findBySubscriptionAndUser(user.getId(), id, pageable);
        return pagedResourcesAssembler.toResource(page, preAssembler);
    }

}
