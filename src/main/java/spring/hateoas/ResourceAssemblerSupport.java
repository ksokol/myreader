package spring.hateoas;

import org.springframework.hateoas.ResourceAssembler;
import org.springframework.hateoas.ResourceSupport;
import org.springframework.util.Assert;

/**
 * @author Kamill Sokol
 */
@Deprecated
public abstract class ResourceAssemblerSupport<T, D extends ResourceSupport> implements ResourceAssembler<T, D> {

    private final Class<T> inputClass;
    private final Class<D> outputClass;

    protected ResourceAssemblerSupport(Class<T> inputClass, Class<D> outputClass) {
        Assert.notNull(inputClass);
        Assert.notNull(outputClass);

        this.inputClass = inputClass;
        this.outputClass = outputClass;
    }

    public boolean supports(Class<?> input, Class<?> output) {
        boolean equalsInput = inputClass.equals(input);
        boolean equalsOutput = outputClass.equals(output);
        return equalsInput && equalsOutput;
    }
}
