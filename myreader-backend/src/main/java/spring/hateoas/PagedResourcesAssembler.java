package spring.hateoas;

import static org.springframework.web.util.UriComponentsBuilder.fromUriString;

import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
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

import java.util.ArrayList;
import java.util.List;

/**
 * @author Oliver Gierke
 * @author Kamill Sokol
 */
@Component
public class PagedResourcesAssembler<T> {

    private final HateoasPageableHandlerMethodArgumentResolver pageableResolver = new HateoasPageableHandlerMethodArgumentResolver();

    public PagedResources<Resource<T>> toResource(Page<T> entity) {
        return toResource(entity, new SimpleResourceAssembler<T>());
    }

    public <R extends ResourceSupport> PagedResources<R> toResource(Page<T> page, ResourceAssembler<T, R> assembler) {
        Assert.notNull(page, "Page must not be null!");
        Assert.notNull(assembler, "ResourceAssembler must not be null!");

        List<R> resources = new ArrayList<>(page.getNumberOfElements());

        for (T element : page) {
            resources.add(assembler.toResource(element));
        }

        PagedResources<R> pagedResources = new PagedResources<>(resources, asPageMetadata(page));
        List<Link> links = addPaginationLinks(page, getDefaultUriString());

        pagedResources.add(links);
        return pagedResources;
    }

    private String getDefaultUriString() {
        final UriComponents uriComponents = ServletUriComponentsBuilder.fromCurrentRequest().build();
        String query = StringUtils.defaultString(uriComponents.getQuery());

        if(StringUtils.isNotEmpty(query)) {
            query = "?" + query;
        }

        return uriComponents.getPath() + query;
    }

    private List<Link> addPaginationLinks(Slice<?> slice, String uri) {
        List<Link> links = new ArrayList<>(3);
        if (slice.hasNext()) {
            links.add(createLink(slice.nextPageable(), uri, Link.REL_NEXT));
        }

        if (slice.hasPrevious()) {
            links.add(createLink(slice.previousPageable(), uri, Link.REL_PREVIOUS));
        }

        links.add(new Link(uri));

        return links;
    }

    private Link createLink(Pageable pageable, String uri, String rel) {
        UriComponentsBuilder builder = fromUriString(uri);
        pageableResolver.enhance(builder, null, pageable);
        return new Link(builder.build().toUriString(), rel);
    }

    private static <T> PagedResources.PageMetadata asPageMetadata(Page<T> page) {
        return new PagedResources.PageMetadata(page.getSize(), page.getNumber(), page.getTotalElements(), page.getTotalPages());
    }

    static class SimpleResourceAssembler<T> implements ResourceAssembler<T, Resource<T>> {
        @Override
        public Resource<T> toResource(T entity) {
            return new Resource<>(entity);
        }
    }
}
