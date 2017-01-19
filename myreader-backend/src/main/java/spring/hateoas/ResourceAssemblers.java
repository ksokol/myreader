package spring.hateoas;

import org.springframework.data.domain.Page;
import org.springframework.hateoas.PagedResources;

/**
 * @author Kamill Sokol
 */
public interface ResourceAssemblers {
    <D> D toResource(Object page, Class<D> output);

    <D> PagedResources<D> toResource(Page<?> page, Class<D> clazz);
}
