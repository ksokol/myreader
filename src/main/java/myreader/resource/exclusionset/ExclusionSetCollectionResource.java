package myreader.resource.exclusionset;

import myreader.entity.ExclusionSet;
import myreader.repository.ExclusionRepository;
import myreader.resource.exclusionset.beans.ExclusionSetGetResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.PagedResources;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import spring.data.ResourceAssemblers;
import spring.security.MyReaderUser;

/**
 * @author Kamill Sokol
 */
@RestController
@RequestMapping(value = "/exclusions")
public class ExclusionSetCollectionResource {

    private final ExclusionRepository exclusionRepository;
    private final ResourceAssemblers resourceAssemblers;

    @Autowired
    public ExclusionSetCollectionResource(ExclusionRepository exclusionRepository, ResourceAssemblers resourceAssemblers) {
        this.exclusionRepository = exclusionRepository;
        this.resourceAssemblers = resourceAssemblers;
    }

    @RequestMapping(value="", method = RequestMethod.GET)
    public PagedResources<Page<ExclusionSetGetResponse>> get(Pageable pageable, @AuthenticationPrincipal MyReaderUser user) {
        Page<ExclusionSet> exclusionPatternPage = exclusionRepository.findAllSetsByUser(user.getId(), pageable);
        return resourceAssemblers.toPagedResource(exclusionPatternPage, ExclusionSetGetResponse.class);
    }
}
