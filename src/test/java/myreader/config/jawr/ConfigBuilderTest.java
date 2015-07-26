package myreader.config.jawr;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;

import org.junit.Test;

import java.util.Properties;

/**
* @author Kamill Sokol
*/
public class ConfigBuilderTest {

    @Test
    public void testSingleBundle() throws Exception {
        Properties properties = new ConfigBuilder()
                .jsBundle("mobile")
                .webjar("/test1.js")
                .build();

        assertThat((String) properties.get("jawr.js.bundle.mobile.id"), is("/mobile.js"));
        assertThat((String) properties.get("jawr.js.bundle.mobile.mappings"), is("webjars:/test1.js"));
    }

    @Test
    public void testMultipleMappings() throws Exception {
        Properties properties = new ConfigBuilder()
                .jsBundle("mobile")
                .webjar("/test1.js")
                .webjar("/test2.js")
                .build();

        assertThat((String) properties.get("jawr.js.bundle.mobile.id"), is("/mobile.js"));
        assertThat((String) properties.get("jawr.js.bundle.mobile.mappings"), is("webjars:/test1.js,webjars:/test2.js"));
    }

    @Test
    public void testMultipleBundles() throws Exception {
        Properties properties = new ConfigBuilder()
                .jsBundle("mobile")
                .webjar("/test1.js")
                .jar("/test2.js")
                .and()
                .cssBundle("desktop")
                .webjar("/test1.css")
                .jar("/test2.css")
                .build();

        assertThat((String) properties.get("jawr.js.bundle.mobile.id"), is("/mobile.js"));
        assertThat((String) properties.get("jawr.js.bundle.mobile.mappings"), is("webjars:/test1.js,jar:/test2.js"));
        assertThat((String) properties.get("jawr.css.bundle.desktop.id"), is("/desktop.css"));
        assertThat((String) properties.get("jawr.css.bundle.desktop.mappings"), is("webjars:/test1.css,jar:/test2.css"));
    }

    @Test
    public void testDebugFlagIsFalse() {
        Properties properties = new ConfigBuilder(false).jsBundle("test").build();
        assertThat(properties.get("jawr.debug.on"), nullValue());
    }

    @Test
    public void testDebugFlagIsTrue() {
        Properties properties = new ConfigBuilder(true).jsBundle("test").build();
        assertThat((String) properties.get("jawr.debug.on"), is("true"));
    }
}
