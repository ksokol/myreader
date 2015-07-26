package myreader;

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
        expectedException.expect(RuntimeException.class);
        expectedException.expectMessage("Invalid file path");

        Starter.main(new String[] {"--tmpdir=\u0000"});
    }
}
