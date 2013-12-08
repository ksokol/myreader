package myreader.reader.web;

import java.beans.PropertyEditorSupport;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

public class StringURLDecoderEditor extends PropertyEditorSupport {

    @Override
    public void setAsText(String text) {
        if (text == null) {
            setValue(null);
        } else {
            String value = text.trim();

            if ("".equals(value)) {
                setValue(null);
            } else {
                try {
                    String decoded = URLDecoder.decode(value, "UTF-8");
                    setValue(decoded);
                } catch (UnsupportedEncodingException e) {
                    throw new IllegalArgumentException(e.getMessage(), e);
                }
            }
        }
    }

}
