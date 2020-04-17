package myreader.resource.exclusionpattern;

import myreader.entity.ExclusionPattern;
import myreader.repository.ExclusionRepository;
import myreader.resource.ResourceConstants;
import myreader.resource.exclusionpattern.beans.ExclusionPatternGetResponse;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * @author Kamill Sokol
 */
@RestController
@RequestMapping(ResourceConstants.EXCLUSIONS_SUBSCRIPTION_PATTERN)
public class ExclusionPatternEntityResource {

    private final RepresentationModelAssembler<ExclusionPattern, ExclusionPatternGetResponse> assembler;
    private final ExclusionRepository exclusionRepository;

    public ExclusionPatternEntityResource(
            RepresentationModelAssembler<ExclusionPattern, ExclusionPatternGetResponse> assembler,
            ExclusionRepository exclusionRepository
    ) {
        this.assembler = assembler;
        this.exclusionRepository = exclusionRepository;
    }

    @ModelAttribute("pattern")
    public ExclusionPattern model(
            @PathVariable("patternId") Long patternId,
            @PathVariable("subscriptionId") Long subscriptionId
    ) {
        ExclusionPattern pattern = exclusionRepository.findByIdAndSubscriptionIdAndCurrentUser(patternId, subscriptionId);
        if (pattern == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return pattern;
    }

    @GetMapping
    public ExclusionPatternGetResponse get(@ModelAttribute("pattern") ExclusionPattern pattern) {
        return assembler.toModel(pattern);
    }

    @DeleteMapping
    public void delete(@ModelAttribute("pattern") ExclusionPattern pattern) {
        exclusionRepository.delete(pattern);
    }
}
