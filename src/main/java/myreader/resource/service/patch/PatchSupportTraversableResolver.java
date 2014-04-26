package myreader.resource.service.patch;

import org.springframework.stereotype.Component;
import org.springframework.util.ClassUtils;

import javax.validation.Path;
import javax.validation.TraversableResolver;
import java.lang.annotation.ElementType;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
@Component
class PatchSupportTraversableResolver implements TraversableResolver {

    private TraversableResolver delegate;

    @Override
    public boolean isReachable(Object traversableObject, Path.Node traversableProperty, Class<?> rootBeanType, Path pathToTraversableObject, ElementType elementType) {
        boolean isReachable = true;
        if(delegate != null) {
            isReachable = delegate.isReachable(traversableObject, traversableProperty, rootBeanType, pathToTraversableObject, elementType);
        }
        if(isReachable) {
            isReachable = maybeFilled(traversableObject, traversableProperty);
        }
        return isReachable;
    }

    @Override
    public boolean isCascadable(Object traversableObject, Path.Node traversableProperty, Class<?> rootBeanType, Path pathToTraversableObject, ElementType elementType) {
        boolean isCascadable = true;
        if(delegate != null) {
            isCascadable = delegate.isCascadable(traversableObject, traversableProperty, rootBeanType, pathToTraversableObject, elementType);
        }
        if(isCascadable) {
            isCascadable = maybeFilled(traversableObject, traversableProperty);
        }
        return isCascadable;
    }

    private boolean maybeFilled(Object traversableObject, Path.Node traversableProperty) {
        boolean assignable = ClassUtils.isAssignable(PatchSupport.class, traversableObject.getClass());
        if(assignable) {
            PatchSupport ps = (PatchSupport) traversableObject;
            return ps.isFieldPatched(traversableProperty.getName());
        }
        return true;
    }

    public TraversableResolver getDelegate() {
        return delegate;
    }

    public void setDelegate(TraversableResolver delegate) {
        this.delegate = delegate;
    }
}
