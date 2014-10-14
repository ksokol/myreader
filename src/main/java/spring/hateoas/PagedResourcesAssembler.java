package spring.hateoas;

import static org.springframework.web.util.UriComponentsBuilder.fromUriString;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.HateoasPageableHandlerMethodArgumentResolver;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.PagedResources;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.hateoas.ResourceSupport;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * @author Oliver Gierke
 * @author Kamill Sokol
 */
@Component
public class PagedResourcesAssembler<T> {

    private final HateoasPageableHandlerMethodArgumentResolver pageableResolver = new HateoasPageableHandlerMethodArgumentResolver();

    public PagedResources<Resource<T>> toResource(Page<T> entity) {
        return toResource(entity, new SimplePagedResourceAssembler<T>());
    }

    public <R extends ResourceSupport> PagedResources<R> toResource(Page<T> page, ResourceAssembler<T, R> assembler) {
        Assert.notNull(page, "Page must not be null!");
        Assert.notNull(assembler, "ResourceAssembler must not be null!");

        List<R> resources = new ArrayList<R>(page.getNumberOfElements());

        for (T element : page) {
            resources.add(assembler.toResource(element));
        }

        PagedResources<R> pagedResources = new PagedResources<R>(resources, asPageMetadata(page));
        return addPaginationLinks(pagedResources, page, getDefaultUriString().toUriString());
    }

    private UriComponents getDefaultUriString() {
        return ServletUriComponentsBuilder.fromCurrentRequest().build();
    }

    private <R extends ResourceSupport> PagedResources<R> addPaginationLinks(PagedResources<R> resources, Page<?> page, String uri) {
        if (page.hasNext()) {
            foo(resources, page.nextPageable(), uri, Link.REL_NEXT);
        }

        if (page.hasPrevious()) {
            foo(resources, page.previousPageable(), uri, Link.REL_PREVIOUS);
        }

        resources.add(new Link(uri));

        return resources;
    }

    private void foo(PagedResources<?> resources, Pageable pageable, String uri, String rel) {
        UriComponentsBuilder builder = fromUriString(uri);
        pageableResolver.enhance(builder, null, pageable);
        resources.add(new Link(builder.build().toUriString(), rel));
    }

    private static <T> PagedResources.PageMetadata asPageMetadata(Page<T> page) {
        Assert.notNull(page, "Page must not be null!");
        return new PagedResources.PageMetadata(page.getSize(), page.getNumber(), page.getTotalElements(), page.getTotalPages());
    }

    private static class SimplePagedResourceAssembler<T> implements ResourceAssembler<T, Resource<T>> {

        @Override
        public Resource<T> toResource(T entity) {
            return new Resource<T>(entity);
        }
    }
}
