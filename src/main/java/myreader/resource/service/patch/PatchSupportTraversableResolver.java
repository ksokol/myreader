package myreader.resource.service.patch;

import java.lang.annotation.ElementType;

import javax.validation.Path;
import javax.validation.TraversableResolver;

import org.springframework.stereotype.Component;
import org.springframework.util.ClassUtils;

/**
 * @author Kamill Sokol
 */
@Component("patchSupportTraversableResolver")
class PatchSupportTraversableResolver implements TraversableResolver {

    @Override
    public boolean isReachable(Object traversableObject, Path.Node traversableProperty, Class<?> rootBeanType, Path pathToTraversableObject, ElementType elementType) {
        return maybeFilled(traversableObject, traversableProperty);
    }

    @Override
    public boolean isCascadable(Object traversableObject, Path.Node traversableProperty, Class<?> rootBeanType, Path pathToTraversableObject, ElementType elementType) {
        throw new UnsupportedOperationException();
    }

    private boolean maybeFilled(Object traversableObject, Path.Node traversableProperty) {
        boolean assignable = ClassUtils.isAssignable(PatchSupport.class, traversableObject.getClass());
        if(assignable) {
            PatchSupport ps = (PatchSupport) traversableObject;
            return ps.isFieldPatched(traversableProperty.getName());
        }
        return true;
    }

}
