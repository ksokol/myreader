package spring.data;

import org.springframework.data.domain.Page;
import org.springframework.hateoas.PagedResources;

/**
 * @author Kamill Sokol
 */
public interface ResourceAssemblers {
    <D> D toResource(Object page, Class<D> output);

    <D> PagedResources<Page<D>> toPagedResource(Page<?> page, Class<D> clazz);
}