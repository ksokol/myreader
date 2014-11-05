package spring.hateoas;

import static org.springframework.web.util.UriComponentsBuilder.fromUriString;

import java.util.ArrayList;
import java.util.List;

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

import spring.data.domain.Sequence;
import spring.data.web.SequenceableHandlerMethodArgumentResolver;

/**
 * @author Oliver Gierke
 * @author Kamill Sokol
 */
@Component
public class PagedResourcesAssembler<T> {

    private final HateoasPageableHandlerMethodArgumentResolver pageableResolver = new HateoasPageableHandlerMethodArgumentResolver();
    private final SequenceableHandlerMethodArgumentResolver sequenceableResolver = new SequenceableHandlerMethodArgumentResolver();

    public PagedResources<Resource<T>> toResource(Page<T> entity) {
        return toResource(entity, new SimpleResourceAssembler<T>());
    }

    public SlicedResources<Resource<T>> toResource(Slice<T> entity) {
        return toResource(entity, new SimpleResourceAssembler<T>());
    }

    public SequencedResources<Resource<T>> toResource(final Sequence<T> entity) {
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
        List<Link> links = addPaginationLinks(page, getDefaultUriString().toUriString());

        pagedResources.add(links);
        return pagedResources;
    }

    public <R extends ResourceSupport> SlicedResources<R> toResource(Slice<T> slice, ResourceAssembler<T, R> assembler) {
        Assert.notNull(slice, "Slice must not be null!");
        Assert.notNull(assembler, "ResourceAssembler must not be null!");

        List<R> resources = new ArrayList<>(slice.getNumberOfElements());

        for (T element : slice) {
            resources.add(assembler.toResource(element));
        }

        SlicedResources<R> pagedResources = new SlicedResources<>(resources, asPageMetadata(slice));
        List<Link> links = addPaginationLinks(slice, getDefaultUriString().toUriString());

        pagedResources.add(links);
        return pagedResources;
    }

    public <R extends ResourceSupport> SequencedResources<R> toResource(final Sequence<T> sequence, final ResourceAssembler<T, R> assembler) {
        Assert.notNull(sequence, "Sequence must not be null!");
        Assert.notNull(assembler, "ResourceAssembler must not be null!");

        List<R> resources = new ArrayList<>(sequence.getSize());

        for (T element : sequence) {
            resources.add(assembler.toResource(element));
        }

        SequencedResources<R> pagedResources = new SequencedResources<>(resources);
        List<Link> links = addPaginationLinks(sequence, getDefaultUriString().toUriString());

        pagedResources.add(links);
        return pagedResources;
    }

    private UriComponents getDefaultUriString() {
        return ServletUriComponentsBuilder.fromCurrentRequest().build();
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

    private List<Link> addPaginationLinks(Sequence<?> sequence, String uri) {
        List<Link> links = new ArrayList<>(2);
        if (sequence.hasNext()) {
            links.add(createLink(sequence, uri, Link.REL_NEXT));
        }

        links.add(new Link(uri));

        return links;
    }

    private Link createLink(Pageable pageable, String uri, String rel) {
        UriComponentsBuilder builder = fromUriString(uri);
        pageableResolver.enhance(builder, null, pageable);
        return new Link(builder.build().toUriString(), rel);
    }

    private Link createLink(Sequence sequence, String uri, String rel) {
        UriComponentsBuilder builder = fromUriString(uri);
        sequenceableResolver.enhance(builder, null, sequence);
        return new Link(builder.build().toUriString(), rel);
    }

    private static <T> PagedResources.PageMetadata asPageMetadata(Page<T> page) {
        return new PagedResources.PageMetadata(page.getSize(), page.getNumber(), page.getTotalElements(), page.getTotalPages());
    }

    private static <T> SlicedResources.PageMetadata asPageMetadata(Slice<T> slice) {
        return new SlicedResources.PageMetadata(slice.getSize(), slice.getNumber());
    }

    static class SimpleResourceAssembler<T> implements ResourceAssembler<T, Resource<T>> {
        @Override
        public Resource<T> toResource(T entity) {
            return new Resource<>(entity);
        }
    }
}
