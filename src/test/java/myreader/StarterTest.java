package myreader;

import static org.junit.Assert.fail;

import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;

/**
 * @author Kamill Sokol
 */
public class StarterTest {

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    @Test
    public void testMain() throws Exception {
        try {
            Starter.main(new String[]{System.getProperty("java.io.tmpdir")});
        } catch (Exception e) {
            fail("failed with unexpected exception: " + e.getMessage());
        }
    }
}
