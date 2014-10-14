package myreader.resource.exclusionpattern;

import myreader.entity.ExclusionPattern;
import myreader.repository.ExclusionRepository;
import myreader.resource.exception.ResourceNotFoundException;
import myreader.resource.exclusionpattern.beans.ExclusionPatternGetResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import spring.hateoas.ResourceAssemblers;
import spring.security.MyReaderUser;

/**
 * @author Kamill Sokol
 */
@RestController
@RequestMapping(value = "/exclusions/{subscriptionId}/pattern/{patternId}")
public class ExclusionPatternEntityResource {

    private final ExclusionRepository exclusionRepository;
    private final ResourceAssemblers resourceAssemblers;

    @Autowired
    public ExclusionPatternEntityResource(ExclusionRepository exclusionRepository, ResourceAssemblers resourceAssemblers) {
        this.exclusionRepository = exclusionRepository;
        this.resourceAssemblers = resourceAssemblers;
    }

    @ModelAttribute("pattern")
    ExclusionPattern model(@PathVariable("patternId") Long patternId, @PathVariable("subscriptionId") Long subscriptionId, @AuthenticationPrincipal MyReaderUser user) {
        ExclusionPattern pattern = exclusionRepository.findByIdAndSubscriptionIdAndUserId(patternId, subscriptionId, user.getId());
        if(pattern == null) {
            throw new ResourceNotFoundException();
        }
        return pattern;
    }

    @RequestMapping(value="", method = RequestMethod.GET)
    public ExclusionPatternGetResponse get(@ModelAttribute("pattern") ExclusionPattern pattern) {
        return resourceAssemblers.toResource(pattern, ExclusionPatternGetResponse.class);
    }
}
