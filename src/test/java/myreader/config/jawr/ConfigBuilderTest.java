package myreader.config.jawr;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

import java.util.Properties;

import org.junit.Test;

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

}
