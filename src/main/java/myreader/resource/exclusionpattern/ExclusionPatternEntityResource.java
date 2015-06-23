package myreader.resource.exclusionpattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import myreader.entity.ExclusionPattern;
import myreader.repository.ExclusionRepository;
import myreader.resource.exception.ResourceNotFoundException;
import myreader.resource.exclusionpattern.beans.ExclusionPatternGetResponse;
import spring.hateoas.ResourceAssemblers;
import spring.security.MyReaderUser;

/**
 * @author Kamill Sokol
 */
@RestController
@RequestMapping(value = "/exclusions/{subscriptionId}/pattern/{patternId}")
public class ExclusionPatternEntityResource {

    private final ResourceAssemblers resourceAssemblers;
    private final ExclusionRepository exclusionRepository;

    @Autowired
    public ExclusionPatternEntityResource(final ResourceAssemblers resourceAssemblers, final ExclusionRepository exclusionRepository) {
        this.resourceAssemblers = resourceAssemblers;
        this.exclusionRepository = exclusionRepository;
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

    @RequestMapping(value="", method = RequestMethod.DELETE)
    public void delete(@ModelAttribute("pattern") ExclusionPattern pattern) {
        exclusionRepository.delete(pattern);
    }
}
