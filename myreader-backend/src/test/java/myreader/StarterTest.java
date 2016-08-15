package myreader;

import org.junit.Test;
import org.springframework.boot.SpringApplication;

import java.util.TimeZone;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.fail;

/**
 * @author Kamill Sokol
 */
public class StarterTest {

    @Test
    public void testMain() throws Exception {
        try {
            Starter.main(new String[]{});

            assertThat(TimeZone.getDefault().getID(), is("UTC"));
            assertThat(System.getProperty("file.encoding"), is("UTF-8"));
        } catch (Exception exception) {
            fail("failed with unexpected exception: " + exception.getMessage());
        } finally {
            if(Starter.applicationContext != null) {
                SpringApplication.exit(Starter.applicationContext);
            }
        }
    }
}
