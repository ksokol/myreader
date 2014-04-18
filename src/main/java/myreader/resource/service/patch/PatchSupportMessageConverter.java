package myreader.resource.service.patch;

import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.http.converter.json.MappingJacksonHttpMessageConverter;
import org.springframework.util.ClassUtils;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.Map;

import static java.util.Map.Entry;

/**
 * @author Kamill Sokol dev@sokol-web.de
 */
public class PatchSupportMessageConverter extends MappingJacksonHttpMessageConverter {

    @Override
    public boolean canRead(Type type, Class<?> contextClass, MediaType mediaType) {
        boolean canRead = super.canRead(type, contextClass, mediaType);
        return canRead && ClassUtils.isAssignable(PatchSupport.class, (Class<?>) type);
    }

    @Override
    public Object read(Type type, Class<?> contextClass, HttpInputMessage inputMessage) throws IOException, HttpMessageNotReadableException {
        return readInternal((Class<?>) type, inputMessage);
    }

    @Override
    protected Object readInternal(Class<?> clazz, HttpInputMessage inputMessage) throws IOException, HttpMessageNotReadableException {
        Map<String, Object>  map = (Map<String, Object>) super.readInternal(Map.class, inputMessage);

        try {
            PatchSupport object = (PatchSupport) clazz.newInstance();
            BeanWrapper beanWrapper = new BeanWrapperImpl(object);

            for (Entry<String, Object> e : map.entrySet()) {
                String key = e.getKey();

                if(beanWrapper.isWritableProperty(key)) {
                    beanWrapper.setPropertyValue(key, e.getValue());
                    object.addPatchedField(key);
                }
            }
            return object;
        } catch (Exception e) {
            throw new HttpMessageNotReadableException(e.getMessage(), e);
        }
    }

    @Override
    public boolean canWrite(Class<?> clazz, MediaType mediaType) {
        return false;
    }

    @Override
    protected boolean canWrite(MediaType mediaType) {
        return false;
    }

    @Override
    protected void writeInternal(Object patchable, HttpOutputMessage outputMessage) throws IOException, HttpMessageNotWritableException {
        throw new UnsupportedOperationException();
    }
}
