package myreader.resource.subscriptiontag;

import myreader.entity.SubscriptionTag;
import myreader.repository.SubscriptionTagRepository;
import myreader.resource.exception.ResourceNotFoundException;
import myreader.resource.subscriptiontag.beans.SubscriptionTagGetResponse;
import myreader.resource.subscriptiontag.beans.SubscriptionTagPatchRequest;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

/**
 * @author Kamill Sokol
 */
@Transactional
@RestController
@RequestMapping(value = "api/2/subscriptionTags/{id}")
public class SubscriptionTagResource {

    private final SubscriptionTagRepository subscriptionTagRepository;
    private final ResourceAssembler<SubscriptionTag, SubscriptionTagGetResponse> assembler;

    public SubscriptionTagResource(SubscriptionTagRepository subscriptionTagRepository,
                                   ResourceAssembler<SubscriptionTag,
                                   SubscriptionTagGetResponse> assembler) {
        this.subscriptionTagRepository = subscriptionTagRepository;
        this.assembler = assembler;
    }

    @RequestMapping(value = "", method = RequestMethod.PATCH)
    public SubscriptionTagGetResponse patch(
            @PathVariable("id") Long id,
            @Valid @RequestBody SubscriptionTagPatchRequest request) {
        SubscriptionTag subscriptionTag =
                subscriptionTagRepository.findByCurrentUserAndId(id).orElseThrow(ResourceNotFoundException::new);

        subscriptionTag.setName(request.getName());
        subscriptionTag.setColor(request.getColor());

        return assembler.toResource(subscriptionTagRepository.save(subscriptionTag));
    }
}
