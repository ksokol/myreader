package myreader.resource.exclusionset;

import myreader.entity.ExclusionSet;
import myreader.repository.ExclusionRepository;
import myreader.resource.exception.ResourceNotFoundException;
import myreader.resource.exclusionset.beans.ExclusionSetGetResponse;
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
@RequestMapping(value = "api/2/exclusions")
public class ExclusionEntityResource {

    private final RepresentationModelAssembler<ExclusionSet, ExclusionSetGetResponse> assembler;
    private final ExclusionRepository exclusionRepository;

    @Autowired
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
        if(exclusionSet == null) {
            throw new ResourceNotFoundException();
        }
        return exclusionSet;
    }

    @RequestMapping(value="/{id}", method = RequestMethod.GET)
    public ExclusionSetGetResponse get(@ModelAttribute("exclusionSet") ExclusionSet exclusionSet) {
        return assembler.toModel(exclusionSet);
    }
}
