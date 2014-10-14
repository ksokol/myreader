package spring.hateoas;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Slice;
import org.springframework.hateoas.PagedResources;

/**
 * @author Kamill Sokol
 */
public interface ResourceAssemblers {
    <D> D toResource(Object page, Class<D> output);

    <D> PagedResources<D> toResource(Page<?> page, Class<D> clazz);

    <D> SlicedResources<D> toResource(Slice<?> slice, Class<D> clazz);

}
