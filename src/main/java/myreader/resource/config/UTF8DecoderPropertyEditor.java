package myreader.resource.config;

import java.beans.PropertyEditorSupport;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

/**
 * @author Kamill Sokol
 */
public class UTF8DecoderPropertyEditor extends PropertyEditorSupport {

    private final String encoding;

    public UTF8DecoderPropertyEditor(String encoding) {
        this.encoding = encoding;
    }

    @Override
    public void setAsText(String text) {
        if (text == null) {
            setValue(null);
            return;
        }
        String value = text.trim();

        try {
            String decoded = URLDecoder.decode(value, encoding);
            setValue(decoded);
        } catch (UnsupportedEncodingException e) {
            throw new IllegalArgumentException(e.getMessage(), e);
        }
    }
}
