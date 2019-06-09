package myreader.resource.subscriptiontag;

import myreader.entity.SubscriptionTag;
import myreader.repository.SubscriptionTagRepository;
import myreader.resource.subscriptiontag.beans.SubscriptionTagGetResponse;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.toList;

/**
 * @author Kamill Sokol
 */
@RestController
@RequestMapping("api/2/subscriptionTags")
public class SubscriptionTagCollectionResource {

    private final SubscriptionTagRepository subscriptionTagRepository;
    private final ResourceAssembler<SubscriptionTag, SubscriptionTagGetResponse> assembler;

    public SubscriptionTagCollectionResource(
            SubscriptionTagRepository subscriptionTagRepository,
            ResourceAssembler<SubscriptionTag, SubscriptionTagGetResponse> assembler
    ) {
        this.subscriptionTagRepository = subscriptionTagRepository;
        this.assembler = assembler;
    }

    @GetMapping
    public Map<String, List<SubscriptionTagGetResponse>> get() {
        List<SubscriptionTag> source = subscriptionTagRepository.findAllByCurrentUser();
        List<SubscriptionTagGetResponse> target = source.stream().map(assembler::toResource).collect(toList());

        Map<String, List<SubscriptionTagGetResponse>> body = new HashMap<>(2);
        body.put("content", target);
        return body;
    }
}
