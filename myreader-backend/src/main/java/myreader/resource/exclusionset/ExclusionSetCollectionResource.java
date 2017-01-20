package myreader.resource.exclusionset;

import myreader.entity.ExclusionSet;
import myreader.repository.ExclusionRepository;
import myreader.resource.exclusionset.beans.ExclusionSetGetResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.PagedResources;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Kamill Sokol
 */
@RestController
@RequestMapping(value = ExclusionSetCollectionResource.EXCLUSIONS_URL)
public class ExclusionSetCollectionResource {

    protected static final String EXCLUSIONS_URL = "/api/2/exclusions";

    private final PagedResourcesAssembler<ExclusionSet> pagedResourcesAssembler;
    private final ResourceAssemblerSupport<ExclusionSet, ExclusionSetGetResponse> assembler;
    private final ExclusionRepository exclusionRepository;

    @Autowired
    public ExclusionSetCollectionResource(final PagedResourcesAssembler<ExclusionSet> pagedResourcesAssembler,
                                          final ResourceAssemblerSupport<ExclusionSet, ExclusionSetGetResponse> assembler,
                                          final ExclusionRepository exclusionRepository) {
        this.pagedResourcesAssembler = pagedResourcesAssembler;
        this.assembler = assembler;
        this.exclusionRepository = exclusionRepository;
    }

    @RequestMapping(value="", method = RequestMethod.GET)
    public PagedResources<ExclusionSetGetResponse> get(Pageable pageable) {
        Page<ExclusionSet> page = exclusionRepository.findAllSetsByUser(pageable);
        return pagedResourcesAssembler.toResource(page, assembler, new Link(EXCLUSIONS_URL));
    }
}
