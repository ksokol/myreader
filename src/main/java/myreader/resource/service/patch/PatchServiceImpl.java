package myreader.resource.service.patch;

import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;
import org.springframework.util.Assert;

import java.beans.PropertyDescriptor;

/**
 * @author Kamill Sokol
 */
class PatchServiceImpl implements PatchService {

    @Override
    public <T> T patch(PatchSupport patchSupport, T toPatch) {
        Assert.notNull(patchSupport);
        Assert.notNull(toPatch);

        BeanWrapper source = new BeanWrapperImpl(patchSupport);
        BeanWrapper target = new BeanWrapperImpl(toPatch);

        patch(patchSupport, source, target);

        return toPatch;
    }

    private void patch(PatchSupport patchSupport, BeanWrapper source, BeanWrapper target) {
        for (PropertyDescriptor propertyDescriptor : target.getPropertyDescriptors()) {
            if(patchSupport.isFieldPatched(propertyDescriptor.getName())) {
                patchProperty(source, target, propertyDescriptor.getName());
            }
        }
    }

    private void patchProperty(BeanWrapper source, BeanWrapper target, String propertyName) {
        target.setPropertyValue(propertyName, source.getPropertyValue(propertyName));
    }
}
