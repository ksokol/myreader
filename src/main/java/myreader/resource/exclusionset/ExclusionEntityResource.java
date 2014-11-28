package myreader.resource.exclusionset;

import myreader.entity.ExclusionSet;
import myreader.repository.ExclusionRepository;
import myreader.resource.RestControllerSupport;
import myreader.resource.exception.ResourceNotFoundException;
import myreader.resource.exclusionset.beans.ExclusionSetGetResponse;
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
@RequestMapping(value = "/exclusions")
public class ExclusionEntityResource extends RestControllerSupport {

    private final ExclusionRepository exclusionRepository;

    @Autowired
    public ExclusionEntityResource(ExclusionRepository exclusionRepository, ResourceAssemblers resourceAssemblers) {
        super(resourceAssemblers);
        this.exclusionRepository = exclusionRepository;
    }

    @ModelAttribute("exclusionSet")
    ExclusionSet model(@PathVariable("id") Long id, @AuthenticationPrincipal MyReaderUser user) {
        ExclusionSet exclusionSet = exclusionRepository.findSetByUser(id, user.getId());
        if(exclusionSet == null) {
            throw new ResourceNotFoundException();
        }
        return exclusionSet;
    }

    @RequestMapping(value="/{id}", method = RequestMethod.GET)
    public ExclusionSetGetResponse get(@ModelAttribute("exclusionSet") ExclusionSet exclusionSet) {
        return resourceAssemblers.toResource(exclusionSet, ExclusionSetGetResponse.class);
    }
}
