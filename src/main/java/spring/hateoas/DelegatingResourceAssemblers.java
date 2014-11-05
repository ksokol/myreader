package spring.hateoas;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.hateoas.PagedResources;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;
import org.springframework.util.CollectionUtils;

import spring.data.domain.Sequence;
import spring.data.domain.SequenceImpl;

/**
 * @author Kamill Sokol
 */
@Component
public class DelegatingResourceAssemblers implements ResourceAssemblers {

    private final List<AbstractResourceAssembler> delegates;
    private final PagedResourcesAssembler pagedResourcesAssembler;

    @Autowired
    public DelegatingResourceAssemblers(List<AbstractResourceAssembler> delegates, PagedResourcesAssembler pagedResourcesAssembler) {
        Assert.notNull(delegates, "delegates is null");
        Assert.notNull(pagedResourcesAssembler, "pagedResourcesAssembler is null");
        this.delegates = delegates;
        this.pagedResourcesAssembler = pagedResourcesAssembler;
    }

    @Override
    public <D> D toResource(Object object, Class<D> output) {
        if(object == null) {
            return null;
        }
        ResourceAssembler assembler = getResourceAssemblerFor(object.getClass(), output);
        return (D) assembler.toResource(object);
    }

    @Override
    public <D> PagedResources<D> toResource(Page<?> page, Class<D> outputClass) {
        if(page == null || CollectionUtils.isEmpty(page.getContent())) {
            return pagedResourcesAssembler.toResource(new PageImpl(Collections.emptyList()));
        }

        Class<?> inputClass = page.getContent().get(0).getClass();
        ResourceAssembler resourceAssembler = getResourceAssemblerFor(inputClass, outputClass);
        return pagedResourcesAssembler.toResource(page, resourceAssembler);
    }

    @Override
    public <D> SlicedResources<D> toResource(Slice<?> slice, Class<D> outputClass) {
        if(slice == null || CollectionUtils.isEmpty(slice.getContent())) {
            return pagedResourcesAssembler.toResource(new SliceImpl(Collections.emptyList()));
        }

        Class<?> inputClass = slice.getContent().get(0).getClass();
        ResourceAssembler resourceAssembler = getResourceAssemblerFor(inputClass, outputClass);
        return pagedResourcesAssembler.toResource(slice, resourceAssembler);
    }

    @Override
    public <D> SequencedResources<D> toResource(final Sequence<?> sequence, final Class<D> outputClass) {
        if(sequence == null || CollectionUtils.isEmpty(sequence.getContent())) {
            return pagedResourcesAssembler.toResource(new SequenceImpl());
        }

        Class<?> inputClass = sequence.getContent().get(0).getClass();
        ResourceAssembler resourceAssembler = getResourceAssemblerFor(inputClass, outputClass);
        return pagedResourcesAssembler.toResource(sequence, resourceAssembler);
    }

    private AbstractResourceAssembler getResourceAssemblerFor(Class<?> inputClass, Class<?> outputClass) {
        for (AbstractResourceAssembler delegate : delegates) {
            if(delegate.supports(inputClass, outputClass)) {
                return delegate;
            }
        }
        throw new IllegalArgumentException(String.format("Cannot determine resource assembler for %s -> %s!", inputClass.getName(), outputClass.getName()));
    }
}
