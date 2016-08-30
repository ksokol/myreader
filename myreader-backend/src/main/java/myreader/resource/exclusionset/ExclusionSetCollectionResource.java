package myreader.resource.exclusionset;

import myreader.entity.ExclusionSet;
import myreader.repository.ExclusionRepository;
import myreader.resource.exclusionset.beans.ExclusionSetGetResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.PagedResources;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import spring.hateoas.ResourceAssemblers;

/**
 * @author Kamill Sokol
 */
@RestController
@RequestMapping(value = "api/2/exclusions")
public class ExclusionSetCollectionResource {

    private final ResourceAssemblers resourceAssemblers;
    private final ExclusionRepository exclusionRepository;

    @Autowired
    public ExclusionSetCollectionResource(final ResourceAssemblers resourceAssemblers, final ExclusionRepository exclusionRepository) {
        this.resourceAssemblers = resourceAssemblers;
        this.exclusionRepository = exclusionRepository;
    }

    @RequestMapping(value="", method = RequestMethod.GET)
    public PagedResources<ExclusionSetGetResponse> get(Pageable pageable) {
        Page<ExclusionSet> exclusionPatternPage = exclusionRepository.findAllSetsByUser(pageable);
        return resourceAssemblers.toResource(exclusionPatternPage, ExclusionSetGetResponse.class);
    }
}
