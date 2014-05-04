package myreader.resource.subscriptiontaggroup;

import myreader.entity.TagGroup;
import myreader.repository.SubscriptionRepository;
import myreader.resource.subscriptiontaggroup.assembler.SubscriptionTagGroupGetResponseAssembler;
import myreader.resource.subscriptiontaggroup.beans.SubscriptionTagGroupGetResponse;
import myreader.service.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import spring.security.MyReaderUser;

/**
 * @author Kamill Sokol
 */
@RequestMapping(value = "/subscriptionTagGroups", produces = MediaType.APPLICATION_JSON_VALUE)
@Controller
public class SubscriptionTagGroupEntityResource {

    private final SubscriptionTagGroupGetResponseAssembler preAssembler = new SubscriptionTagGroupGetResponseAssembler(SubscriptionTagGroupEntityResource.class);
    private final SubscriptionRepository subscriptionRepository;

    @Autowired
    public SubscriptionTagGroupEntityResource(SubscriptionRepository subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }

    @ModelAttribute
    public TagGroup find(@PathVariable("id") String id, @AuthenticationPrincipal MyReaderUser user) {
        TagGroup tagGroup = subscriptionRepository.findTagGroupByTagAndUser(id, user.getId());
        if(tagGroup == null) {
            throw new EntityNotFoundException();
        }
        return tagGroup;
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    @ResponseBody
    public SubscriptionTagGroupGetResponse get(@PathVariable("id") String tag, TagGroup tagGroup) {
        return preAssembler.toResource(tagGroup);
    }
}
