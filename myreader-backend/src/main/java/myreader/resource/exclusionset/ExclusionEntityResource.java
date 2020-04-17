package myreader.resource.exclusionset;

import myreader.entity.ExclusionSet;
import myreader.repository.ExclusionRepository;
import myreader.resource.ResourceConstants;
import myreader.resource.exclusionset.beans.ExclusionSetGetResponse;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * @author Kamill Sokol
 */
@RestController
public class ExclusionEntityResource {

    private final RepresentationModelAssembler<ExclusionSet, ExclusionSetGetResponse> assembler;
    private final ExclusionRepository exclusionRepository;

    public ExclusionEntityResource(
            RepresentationModelAssembler<ExclusionSet, ExclusionSetGetResponse> assembler,
            ExclusionRepository exclusionRepository
    ) {
        this.assembler = assembler;
        this.exclusionRepository = exclusionRepository;
    }

    @ModelAttribute("exclusionSet")
    public ExclusionSet model(@PathVariable("id") Long id) {
        ExclusionSet exclusionSet = exclusionRepository.findSetByCurrentUser(id);
        if (exclusionSet == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return exclusionSet;
    }

    @GetMapping(ResourceConstants.EXCLUSION)
    public ExclusionSetGetResponse get(@ModelAttribute("exclusionSet") ExclusionSet exclusionSet) {
        return assembler.toModel(exclusionSet);
    }
}
