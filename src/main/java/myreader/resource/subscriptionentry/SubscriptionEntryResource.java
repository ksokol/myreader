package myreader.resource.subscriptionentry;

import myreader.entity.SubscriptionEntry;
import myreader.repository.SubscriptionEntryRepository;
import myreader.resource.exception.ResourceNotFoundException;
import myreader.resource.subscriptionentry.assembler.SubscriptionEntryGetResponseAssembler;
import myreader.resource.subscriptionentry.beans.SubscriptionEntryGetResponse;
import myreader.service.search.SubscriptionEntrySearchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import spring.security.MyReaderUser;

/**
 * @author Kamill Sokol
 */
@Controller
@RequestMapping("subscriptionEntries")
public class SubscriptionEntryResource {

	private final SubscriptionEntryGetResponseAssembler preAssembler = new SubscriptionEntryGetResponseAssembler(SubscriptionEntryResource.class);
    private final SubscriptionEntryRepository subscriptionEntryRepository;
    private final SubscriptionEntryGetResponseAssembler assembler = new SubscriptionEntryGetResponseAssembler(SubscriptionEntryResource.class);

	@Autowired
	private SubscriptionEntrySearchRepository subscriptionEntrySearchRepository;
	@Autowired
	private  PagedResourcesAssembler pagedResourcesAssembler;

    @Autowired
    public SubscriptionEntryResource(SubscriptionEntryRepository subscriptionEntryRepository) {
        this.subscriptionEntryRepository = subscriptionEntryRepository;
    }

    @ModelAttribute
    public SubscriptionEntry find(@PathVariable("id") Long id, @AuthenticationPrincipal MyReaderUser user) {
        SubscriptionEntry entry = subscriptionEntryRepository.findByIdAndUsername(id, user.getUsername());
        if(entry == null) {
            throw new ResourceNotFoundException();
        }
        return entry;
    }

    @ResponseBody
    @RequestMapping(value= "{id}", method = RequestMethod.GET)
    public SubscriptionEntryGetResponse get(SubscriptionEntry subscriptionEntry) {
        return assembler.toResource(subscriptionEntry);
    }
}
