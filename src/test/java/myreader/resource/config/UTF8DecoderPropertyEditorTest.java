package myreader.resource.config;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;

import org.junit.Test;

/**
 * @author Kamill Sokol
 */
public class UTF8DecoderPropertyEditorTest {

    @Test
    public void testSetAsText() throws Exception {
        UTF8DecoderPropertyEditor pe = new UTF8DecoderPropertyEditor("UTF-8");
        pe.setAsText("%25");
        assertThat(pe.getAsText(), is("%"));
    }

    @Test
    public void testSetAsTextTrim() throws Exception {
        UTF8DecoderPropertyEditor pe = new UTF8DecoderPropertyEditor("UTF-8");
        pe.setAsText("  %25  \n");
        assertThat(pe.getAsText(), is("%"));
    }

    @Test
    public void testSetAsTextNull() throws Exception {
        UTF8DecoderPropertyEditor pe = new UTF8DecoderPropertyEditor("UTF-8");
        pe.setAsText(null);
        assertThat(pe.getAsText(), nullValue());
    }

    @Test(expected = IllegalArgumentException.class)
    public void testSetAsTextException() throws Exception {
        UTF8DecoderPropertyEditor pe = new UTF8DecoderPropertyEditor("");
        pe.setAsText("irrelevant");
    }
}
