package spring.data;

import org.springframework.hateoas.ResourceAssembler;
import org.springframework.hateoas.ResourceSupport;
import org.springframework.util.Assert;

/**
 * @author Kamill Sokol
 */
public abstract class AbstractResourceAssembler<T, D extends ResourceSupport> implements ResourceAssembler<T, D> {

    private final Class<T> inputClass;
    private final Class<D> outputClass;

    protected AbstractResourceAssembler(Class<T> inputClass, Class<D> outputClass) {
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

    protected Class<D> getOutputClass() {
        return outputClass;
    }
}