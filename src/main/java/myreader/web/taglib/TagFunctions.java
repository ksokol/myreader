package myreader.web.taglib;

import static org.apache.commons.lang3.StringUtils.EMPTY;

import java.util.Date;

import org.apache.commons.lang.StringUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.fasterxml.jackson.databind.ObjectMapper;

import freemarker.template.SimpleHash;
import freemarker.template.TemplateBooleanModel;
import freemarker.template.TemplateModel;
import freemarker.template.TemplateModelException;
import freemarker.template.TemplateModelIterator;
import freemarker.template.TemplateScalarModel;
import myreader.web.QueryString;
import spring.security.MyReaderUser;

public class TagFunctions {

    private static final ObjectMapper om = new ObjectMapper();

    public static String toJSON(Object object) throws Exception {
        return om.writeValueAsString(object);
    }

    public static String uriEncode(String s)  {
        return s.replaceAll("/", "%252F");
    }

    public static String ignore(SimpleHash qs, String keyToIgnore) throws TemplateModelException {
        QueryString newOne = new QueryString();

        if (qs != null) {
            final TemplateModelIterator iterator = qs.keys().iterator();

            while(iterator.hasNext()) {
                final TemplateModel next = iterator.next();
                final String key = next.toString();
                if (!key.equals(keyToIgnore)) {
                    final TemplateModel templateModel = qs.get(key);
                    if(templateModel instanceof TemplateBooleanModel) {
                        TemplateBooleanModel booleanModel = (TemplateBooleanModel) templateModel;
                        newOne.put(key, booleanModel.getAsBoolean());
                    }
                    if(templateModel instanceof TemplateScalarModel) {
                        TemplateScalarModel scalarModel = ( TemplateScalarModel) templateModel;
                        newOne.put(key, scalarModel.getAsString());
                    }
                }
            }
        }
        return newOne.toString();
    }

    public static String replace(SimpleHash qs, String keyToReplace, String replaceWith) throws TemplateModelException {
        QueryString newOne = new QueryString();
        if (qs == null) {
            return newOne.toString();
        }

        final TemplateModelIterator iterator = qs.keys().iterator();

        while(iterator.hasNext()) {
            final TemplateModel next = iterator.next();
            final String key = next.toString();
            if (key.equals(keyToReplace)) {
                newOne.put(key, replaceWith);
            } else {
                final TemplateModel templateModel = qs.get(key);
                if(templateModel instanceof TemplateBooleanModel) {
                    TemplateBooleanModel booleanModel = (TemplateBooleanModel) templateModel;
                    newOne.put(key, booleanModel.getAsBoolean());
                }
                if(templateModel instanceof TemplateScalarModel) {
                    TemplateScalarModel scalarModel = ( TemplateScalarModel) templateModel;
                    newOne.put(key, scalarModel.getAsString());
                }
            }
        }

        return newOne.toString();
    }

    public static String toQueryString(SimpleHash qs) throws TemplateModelException {
        QueryString newOne = new QueryString();
        if (qs == null) {
            return newOne.toString();
        }

        final TemplateModelIterator iterator = qs.keys().iterator();

        while(iterator.hasNext()) {
            final TemplateModel next = iterator.next();
            final String key = next.toString();

            final TemplateModel templateModel = qs.get(key);
            if(templateModel instanceof TemplateBooleanModel) {
                TemplateBooleanModel booleanModel = (TemplateBooleanModel) templateModel;
                newOne.put(key, booleanModel.getAsBoolean());
            }
            if(templateModel instanceof TemplateScalarModel) {
                TemplateScalarModel scalarModel = ( TemplateScalarModel) templateModel;
                newOne.put(key, scalarModel.getAsString());
            }
        }

        return newOne.toString();
    }

    public static String queryParam(String key) {
        final ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        final String[] parameterValues = requestAttributes.getRequest().getParameterValues(key);

        if(parameterValues != null && parameterValues.length > 0) {
            return StringUtils.defaultString(parameterValues[0]);
        }

        return EMPTY;
    }

    public static String authentication() {
        MyReaderUser user = (MyReaderUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return user.getUsername();
    }

    public static String timeAgo(Date date) {
        return TimeAgoFunction.format(date);
    }

}
