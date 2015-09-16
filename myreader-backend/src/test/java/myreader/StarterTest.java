package myreader;

import static org.junit.Assert.fail;

import org.junit.Test;

/**
 * @author Kamill Sokol
 */
public class StarterTest {

    @Test
    public void testMain() throws Exception {
        try {
            Starter.main(new String[]{System.getProperty("java.io.tmpdir")});
        } catch (Exception e) {
            fail("failed with unexpected exception: " + e.getMessage());
        }
    }
}
