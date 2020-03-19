package myreader.resource.exclusionpattern;

import myreader.entity.ExclusionPattern;
import myreader.repository.ExclusionRepository;
import myreader.resource.exception.ResourceNotFoundException;
import myreader.resource.exclusionpattern.beans.ExclusionPatternGetResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Kamill Sokol
 */
@RestController
@RequestMapping(value = "api/2/exclusions/{subscriptionId}/pattern/{patternId}")
public class ExclusionPatternEntityResource {

    private final RepresentationModelAssembler<ExclusionPattern, ExclusionPatternGetResponse> assembler;
    private final ExclusionRepository exclusionRepository;

    @Autowired
    public ExclusionPatternEntityResource(
            RepresentationModelAssembler<ExclusionPattern, ExclusionPatternGetResponse> assembler,
            ExclusionRepository exclusionRepository
    ) {
        this.assembler = assembler;
        this.exclusionRepository = exclusionRepository;
    }

    @ModelAttribute("pattern")
    public ExclusionPattern model(@PathVariable("patternId") Long patternId, @PathVariable("subscriptionId") Long subscriptionId) {
        ExclusionPattern pattern = exclusionRepository.findByIdAndSubscriptionIdAndCurrentUser(patternId, subscriptionId);
        if(pattern == null) {
            throw new ResourceNotFoundException();
        }
        return pattern;
    }

    @RequestMapping(value="", method = RequestMethod.GET)
    public ExclusionPatternGetResponse get(@ModelAttribute("pattern") ExclusionPattern pattern) {
        return assembler.toModel(pattern);
    }

    @RequestMapping(value="", method = RequestMethod.DELETE)
    public void delete(@ModelAttribute("pattern") ExclusionPattern pattern) {
        exclusionRepository.delete(pattern);
    }
}
